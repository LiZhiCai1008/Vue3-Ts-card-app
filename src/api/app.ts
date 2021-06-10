import request from "@/request/interceptors"
import { HttpResponse } from "@/types/Response.d"
import {
  GetMsgCodeParams,
  GetTradeRecordParams,
  GetPackageParams,
  WxPay
} from "@/api/types/App"


//封装储值卡app的接口方法
export class AppService {
  /**
   * @description 获取短信验证码
   * @param {Object} GetMsgCodeParams
   * @return {HttpResponse} result
   */
  // 获取手机验证码
  static getVCodeWhiteApi(data: GetMsgCodeParams): Promise<HttpResponse> {
    return request({
      url: 'service/other/notice/v1/send/sms/vCode/white',
      method: 'post',
      data
    })
  }
  // 获取消费记录
  static getTradeRecordApi(params: GetTradeRecordParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/tradeRecord/h5/v1/page',
      method: 'get',
      params
    })
  }
  // 获取充值套餐
  static getChargePackageApi(params: GetPackageParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/recharge/v1/packages',
      method: 'get',
      params
    })
  }
  // 微信支付
  static wxPayApi(data: WxPay): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/recharge/v1/wx/pay',
      method: 'post',
      data
    })
  }
}