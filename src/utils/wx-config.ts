// import { Dialog } from 'vant';
// import { weinxinConfigApi } from '../api/entery';
// const wx = window.wx;
// export const getWxJsConfigAction = async () => {
//   const { code, content } = await weinxinConfigApi({
//     url: window.location.href.split("#")[0]
//   })
//   if (code == 200) {
//     console.log(content)
//     localStorage.setItem("JS_CONFIG", JSON.stringify(content))
//     wx.config({
//       debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//       appId: content.appId, // 必填，公众号的唯一标识
//       timestamp: content.timestamp.toString(), // 必填，生成签名的时间戳
//       nonceStr: content.noncestr, // 必填，生成签名的随机串
//       signature: content.signature, // 必填，签名，见附录1
//       jsApiList: ["hideAllNonBaseMenuItem", "scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见
//     });
//     wx.ready(function () {
//       wx.hideAllNonBaseMenuItem();
//     });
//     wx.error(function (res) {
//       Dialog({
//         message: `微信权限注入失败：${res.errMsg}`,
//         confirmButtonColor: '#F8B500'
//       });
//     });
//   } else {
//     Dialog({
//       message: '微信权限注入失败',
//       confirmButtonColor: '#F8B500'
//     });
//   }
// }