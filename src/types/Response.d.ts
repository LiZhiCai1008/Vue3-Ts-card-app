// 接口响应通过格式
export interface HttpResponse {
  status: number
  statusText: string
  data: {
    code: number
    message: string
    [key: string]: any
  }
}

// 签名类型声明
export interface SignType {
  "Dahuange-User-Access-App-Id": string,
  "Dahuange-User-Access-App-Nonce": string,
  "Dahuange-User-Access-App-Timestrap": number,
  "Dahuange-User-Access-App-Sign": string
}