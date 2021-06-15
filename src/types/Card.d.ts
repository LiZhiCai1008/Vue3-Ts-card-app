// 卡信息【列表】
export interface Card {
  cardNo: string | number,
  serialNo: string,
  cardName?: string,
  cardId?: string | number,
  coverUrl?: string,
  [key: string]: any
}
// 用户信息
export interface MemberInfo {
  phone: string | number,
  memberNo: string | number,
  [key: string]: any
}
// format函数
export interface FormatType {
  (value: number): string
}
// user 菜单列表
export interface MenuItem {
  name: string,
  icon: string,
  urlName: string | number,
  query?: any,
  auth: boolean
}
// 套餐item
export interface PackageItem {
  cardId: string,
  gmtCreated?: string,
  rechargeAmount: number,
  rechargeItemSendId: number,
  rechargeId: number,
  gmtModified?: string,
  sendAmount: number,
  checked?: boolean
}