// 绑定储值卡接口
export interface BindCardParams {
  cardNo: string,
  serialNo: string,
  phone: string | number,
  vcode: string | number,
  userName: string,
  remark?: string,
  memberNo: string | number,
  orgId: string
}

// 更新储值卡绑定的手机号接口
export interface UpdatePhoneParams {
  cardNo: string,
  serialNo: string,
  oldPhoneCode: string | number,
  newPhone: string | number,
  newPhoneCode: string | number,
  memberNo:  string | number,
}