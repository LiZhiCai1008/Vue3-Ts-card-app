// 获取短信验证码接口参数
export interface GetOpenIdParams {
  thirdPlatform?: number,
  businessSource?: number,
  thirdPlatformSource?: number,
  code: string,
  appId: string,
  orgId: string
}

// 获取用户手机号接口
export interface GetMemberParams {
  openId: string,
  findFlag: boolean
}

// 绑定登录手机号接口
export interface BindPhoneParams {
  openId: string,
  scanAppName: string,
  appId?: string,
  phone: string,
  phoneCode: string | number
}

// 获取jsapi接口
export interface GetJsApiParams {
  url: string
}