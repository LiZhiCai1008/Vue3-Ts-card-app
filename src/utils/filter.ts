// /**
//  * Created by lizhicai on 5/31/2021.
//  */
// import fl from "./float";

// export const amountFmt = (value: any) => {
//   return fl.float.divide(value, 100, "divide").toFixed(2);
// }
// export default {
//   install: Vue => {
//     Vue.filter("amountFmt", amountFmt);

//     Vue.filter("statusFmt", function (value) {
//       let statusText = {
//         1: "正常",
//         2: "禁用",
//         3: "挂失",
//         4: "补卡中",
//         99: "注销",
//       }
//       return statusText[value];
//     });

//     Vue.filter("rateFmt", function (value: any) {
//       return fl.float.multiply(value, 100, "multiply");
//     });
//   }
// };