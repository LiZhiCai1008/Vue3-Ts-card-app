import { Dialog } from 'vant';
import { EnteryService } from '../api/entery';

export const getWxJsConfigAction = async (): Promise<any> => {
  const { data } = await EnteryService.weinxinConfigApi({
    url: window.location.href.split("#")[0]
  })
  if (data.code == 200) {
    console.log(data.content)
    localStorage.setItem("JS_CONFIG", JSON.stringify(data.content))
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.content.appId, // 必填，公众号的唯一标识
      timestamp: data.content.timestamp.toString(), // 必填，生成签名的时间戳
      nonceStr: data.content.noncestr, // 必填，生成签名的随机串
      signature: data.content.signature, // 必填，签名，见附录1
      jsApiList: ["hideAllNonBaseMenuItem", "scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见
    });
    wx.ready(function () {
      wx.hideAllNonBaseMenuItem();
    });
    wx.error(function (res: any) {
      Dialog({
        message: `微信权限注入失败：${res.errMsg}`,
        confirmButtonColor: '#F8B500'
      });
    });
  } else {
    Dialog({
      message: '微信权限注入失败',
      confirmButtonColor: '#F8B500'
    });
  }
}