// 获取短信验证码接口参数
export interface GetMsgCodeParams {
  phone: string | number,
  templateType: string,
  params?: any,
  nonceStr: string,
  signName: string
}
// 获取消费记录列表接口
export interface GetTradeRecordParams {
  cardNo: string,
  serialNo: string,
  page: number,
  pageSize: number
}
// 获取充值套餐接口
export interface GetPackageParams {
  cardNo: string,
  serialNo: string
}
// 微信充值支付接口
export interface WxPay {
  cardNo: string,
  serialNo: string,
  amount: number,
  packAgeId: string,
  phone: string | number,
  openId: string
}