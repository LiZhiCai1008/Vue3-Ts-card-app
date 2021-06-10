import request from "@/request/interceptors"
import { HttpResponse } from "@/types/Response.d"
import { GetOpenIdParams, GetMemberParams, BindPhoneParams, GetJsApiParams } from "@/api/types/Entery"


//封装储值卡app的接口方法
export class EnteryService {
  /**
   * @description 获取openId
   * @param {Object} GetOpenIdParams
   * @return {HttpResponse} result
   */
  // 获取openId
  static getWeixinOpenIdApi(data: GetOpenIdParams): Promise<HttpResponse> {
    return request({
      url: 'web/qrcode/thirdAuth/v1/white',
      method: 'post',
      data: {
        thirdPlatform: 1,
        businessSource: 8,
        thirdPlatformSource: 1,
        code: data.code,
        appId: data.appId,
        orgId: data.orgId
      }
    })
  }
  // 通过openId获取用户绑定信息
  static getBindByOpenidApi(params: GetMemberParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/coupon/memberInfo/v1/infoByOpenId',
      method: 'get',
      params
    })
  }
  // 手机验证码登录
  static bindMemberApi(data: BindPhoneParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/coupon/memberInfo/v1/login',
      method: 'post',
      data
    })
  }
  // 获取微信jsapi签名检验
  static weinxinConfigApi(params: GetJsApiParams): Promise<HttpResponse> {
    return request({
      url: 'web/qrcode/wx/jsapi/v1',
      method: 'get',
      params: {
        ...params,
        orgId: localStorage.getItem("ORG_ID") || "",
        businessSource: 8,
      }
    })
  }
}