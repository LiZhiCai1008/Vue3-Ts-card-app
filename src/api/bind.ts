import request from "@/request/interceptors"
import { HttpResponse } from "@/types/Response.d"
import { BindCardParams, UpdatePhoneParams } from "@/api/types/Bind"


export class BindService {
  /**
   * @description 绑定手机号
   * @param {Object} BindCardParams
   * @return {HttpResponse} result
   */
  // 绑定手机号
  static cardBindApi(data: BindCardParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/cardBind',
      method: 'post',
      data: {
        ...data
      }
    })
  }
  // 更新储值卡绑定的手机号
  static updateCardPhoneApi(data: UpdatePhoneParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/changePhone',
      method: 'post',
      data: {
        ...data
      }
    })
  }
}