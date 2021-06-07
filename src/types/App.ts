// 获取短信验证码接口参数
export interface GetMsgCodeParams {
  phone: string | number,
  templateType: string,
  params?: any,
  nonceStr: string,
  signName: string
}