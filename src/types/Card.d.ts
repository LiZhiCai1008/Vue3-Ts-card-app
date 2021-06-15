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

export interface FormatType {
  (value: number): string
}