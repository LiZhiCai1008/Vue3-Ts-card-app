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
// 更新消费限制接口
export interface UpdateLimitParams {
  cardNo: string,
  serialNo: string,
  singleDayLimit?: string | number,
  singleOrderLimit?: string | number,
  orderNumLimit?: string | number
}

// 更新卡状态接口
export interface UpdateStatusParams {
  cardNo: string | number,
  serialNo: string | number,
  status: number
}