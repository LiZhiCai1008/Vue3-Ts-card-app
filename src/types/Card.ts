// 获取储值卡详情接口参数
export interface GetCardListParams {
  phone: string | number,
  orgId: string | number
}
// 获取卡详情接口参数
export interface GetCardInfoParams {
  cardNo: string | number,
  serialNo: string | number,
  cardId?: string | number,
  phone: string,
  orgId: string
}