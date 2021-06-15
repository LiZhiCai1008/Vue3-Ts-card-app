import CryptoJS from "crypto-js";
import stringify from "json-stable-stringify";
import { SignType } from '@/types/Response.d';
import { AxiosRequestConfig } from 'axios';
interface Sign {
  "Dahuange-User-Access-App-Id": string,
  "Dahuange-User-Access-App-Nonce": string,
  "Dahuange-User-Access-App-Timestrap": number,
  [key: string]: any
}
interface AnyObj {
  [key: string]: any
}
function fliterObjs(objs: AnyObj) {
  if (Object.prototype.toString.call(objs) !== "[object Object]") {
    console.error("请传入一个对象");
    return;
  }
  for (const key in objs) {
    if (Object.prototype.toString.call(objs[key]) == "[object Array]") {
      objs[key].forEach((item: AnyObj) => {
        if (Object.prototype.toString.call(item) == "[object Object]") {
          fliterObjs(item);
        }
      });
    } else if (Object.prototype.toString.call(objs[key]) == "[object Object]") {
      fliterObjs(objs[key]);
    } else {
      if (objs[key] == null) {
        objs[key] = "";
      }
    }
  }
  return objs;
}
function getRequest(url: string) {
  const theRequest: AnyObj = {}
  if (url.indexOf('?') != -1) {
    const str = url.substr(url.indexOf('?') + 1),
      strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
    }
  }
  return theRequest
}

export const getSin = (appid = "", appSecret = "", config: AxiosRequestConfig): SignType => {
  let query = null,
    body = null;
  if (config && config.params) {
    query = config.params;
  }
  if (config && config.data) {
    body = config.data;
  }

  const timestrap = new Date().getTime();
  const nonce = Math.random()
    .toString(36)
    .substr(3);
  const sign: Sign = {
    "Dahuange-User-Access-App-Id": appid,
    "Dahuange-User-Access-App-Nonce": nonce,
    "Dahuange-User-Access-App-Timestrap": timestrap,
    ...getRequest(config.url || ""),
  };
  // 处理get请求参数
  if (query && JSON.stringify(query) !== "{}") {
    // key字典排序
    const keys = Object.keys(query).sort();
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      if (query[key] === null || query[key] === undefined) {
        delete query[key];
      } else {
        query[key] = query[key].toString();
      }
      if (key != "app_sign") {
        sign[key] = query[key];
      }
    }
  }
  if (body && JSON.stringify(body) !== "{}") {
    const signKey = Object.keys(body).sort();
    const tempBody = JSON.parse(stringify(body));
    signKey.forEach(v => {
      if (
        tempBody[v] == null ||
        tempBody[v] === undefined ||
        tempBody[v] === ""
      ) {
        delete tempBody[v];
      }
    });
    const datas = fliterObjs(tempBody);
    config.data = datas;
    sign.payload = stringify(datas);
  }
  let signStr = "";
  const signKey = Object.keys(sign).sort();
  signKey.forEach(key => {
    if (sign[key]) {
      signStr += key + "=" + sign[key] + "&";
    }
  });
  signStr = signStr.substring(0, signStr.length - 1);
  // signStr = CryptoJS.enc.Utf8.parse(signStr).toString()
  signStr = CryptoJS.MD5(signStr).toString();

  sign["Dahuange-User-Access-App-Sign"] = CryptoJS.HmacSHA1(
    signStr,
    appSecret
  ).toString();

  if (sign.payload) {
    delete sign.payload;
  }
  const signOptions: SignType = {
    "Dahuange-User-Access-App-Id": appid,
    "Dahuange-User-Access-App-Nonce": nonce,
    "Dahuange-User-Access-App-Timestrap": timestrap,
    "Dahuange-User-Access-App-Sign": sign["Dahuange-User-Access-App-Sign"]
  };
  return signOptions;
};
export default getSin;
