import request from "@/request/interceptors"
import { HttpResponse } from "@/types/Response.d"
import { GetCardListParams, GetCardInfoParams } from "@/types/Card"


//封装储值卡的接口方法
export class CardService {
  /**
   * @description 查询储值卡列表
   * @param {Object} GetCardListParams
   * @return {HttpResponse} result
   */
  static getUserCardListApi(params: GetCardListParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/listUserCard',
      method: "get",
      params: {
        ...params
      }
    })
  }
  // 获取卡信息详情接口
  static getCardInfoApi(params: GetCardInfoParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/getCardInfo',
      method: "get",
      params: {
        ...params
      }
    })
  }
  // 更新储值卡消费限制
  static updateLimitApi(data: GetCardListParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/updateLimit',
      method: "post",
      data: {
        ...data
      }
    })
  }
  // 更新储值卡状态
  static updateCardStatusApi(data: GetCardListParams): Promise<HttpResponse> {
    return request({
      url: 'service/marketing/memberCard/h5/v1/updateStatus',
      method: "post",
      data: {
        ...data
      }
    })
  }
}