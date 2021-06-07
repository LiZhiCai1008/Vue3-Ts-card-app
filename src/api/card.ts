import request from "@/request/interceptors"
import { HttpResponse } from "@/types/Response"
import { GetCardListParams } from "@/types/Card"


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
}