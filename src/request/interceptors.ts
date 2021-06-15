// http.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from "qs"
import { Toast } from 'vant';
import getSignOptions from './getSignOptions'

const service: AxiosInstance = axios.create({
  // 联调
  // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
  baseURL: process.env.VUE_APP_BASE_API,
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 60000,
  transformRequest: [(data) => {
    data = JSON.stringify(data)
    return data
  }],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  transformResponse: [(data) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data)
    }
    return data
  }]
  
})

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()
/**
 * 添加请求
 * @param {Object} config 
 */
const addPending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
    if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
      pending.set(url, cancel)
    }
  })
}
/**
 * 移除请求
 * @param {Object} config 
 */
const removePending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = (): void => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
}

// 请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  // console.log(config, "config");
  // let token = localStorage.getItem("TOKEN");
  // if (token) {
  //   // 判断是否存在token，如果存在的话，则每个http header都加上token
  //   config.headers.common["authorization"] = token;
  // }
  removePending(config) // 在请求开始前，对之前的请求做检查取消操作
  addPending(config) // 将当前请求添加到 pending 中
  config.headers = {
    ...config.headers,
    "Content-Type": "application/json;charset=UTF-8",
    "Dahuange-User-Access-Token": localStorage.getItem("casToken") || ""
  };
  const signOptions = getSignOptions("RECHARGE_CARD_CONSUMER", config);
  config.headers = {
    ...config.headers,
    ...signOptions
  };
  console.log(`%c<-------${config.url}-------->`, 'color: red;font-size: 18px' , config.data || config.params)
  return config;
}, (error) => {
  // 错误抛到业务代码
  Toast({
    message: "请求方式错误",
    duration: 3000
  });
  return Promise.reject(error);
})

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  // const status = response.status
  removePending(response) // 在请求结束后，移除本次请求
  const { code, message } = response.data;
  if (code == 10002 || code == 10006 || code == 10005 || code == 10034) {
    // 10002 token已经过期，10006登录状态失效
    // resetAllStorage();
    return response;
  }
  const WHITE_CODES = [83001];
  if (
    (response && response.data && code < 0) ||
    (code && code !== 200 && code !== 100)
  ) {
    // 更改错误码，增加情况，当code不为100，不为200，且code存在的时候
    if (!WHITE_CODES.includes(code) && message) {
      Toast({
        message: message,
        duration: 3000
      });
    }
    return Promise.reject(response);
  }
  return response;
}, (error) => {
  if (axios.isCancel(error)) {
    console.log('repeated request: ' + error.message)
  } else {
    // handle error code
    // 错误抛到业务代码
    switch (error.response.status) {
      case 401:
        console.log("接口返回401！！！！！！！！！！！！！");
        return Promise.reject(error.response.data); // 返回接口返回的错误信息
    }
    if (error.response.status !== 400) {
      Toast({
        message: error.message,
        duration: 3000
      });
    }
  }
  return Promise.reject(error)
})

export default service