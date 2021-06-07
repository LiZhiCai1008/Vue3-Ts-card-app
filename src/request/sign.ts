// import CryptoJS from "crypto-js";
// import stringify from "json-stable-stringify";
// function fliterObjs(objs) {
//   if (Object.prototype.toString.call(objs) !== "[object Object]") {
//     console.error("请传入一个对象");
//     return;
//   }
//   for (let key in objs) {
//     if (Object.prototype.toString.call(objs[key]) == "[object Array]") {
//       objs[key].forEach(item => {
//         if (Object.prototype.toString.call(item) == "[object Object]") {
//           fliterObjs(item);
//         }
//       });
//     } else if (Object.prototype.toString.call(objs[key]) == "[object Object]") {
//       fliterObjs(objs[key]);
//     } else {
//       if (objs[key] == null) {
//         objs[key] = "";
//       }
//     }
//   }
//   return objs;
// }
// function getRequest(url) {
//   let theRequest = {}
//   if (url.indexOf('?') != -1) {
//     let str = url.substr(url.indexOf('?') + 1),
//       strs = str.split('&')
//     for (let i = 0; i < strs.length; i++) {
//       theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
//     }
//   }
//   return theRequest
// }

// export const getSin = (appid = "", appSecret = "", config) => {
//   let query = null,
//     body = null;
//   if (config && config.params) {
//     query = config.params;
//   }
//   if (config && config.data) {
//     body = config.data;
//   }

//   let timestrap = new Date().getTime();
//   let nonce = Math.random()
//     .toString(36)
//     .substr(3);
//   let sign = {
//     "Dahuange-User-Access-App-Id": appid,
//     "Dahuange-User-Access-App-Nonce": nonce,
//     "Dahuange-User-Access-App-Timestrap": timestrap,
//     ...getRequest(config.url),
//   };
//   if (query && JSON.stringify(query) !== "{}") {
//     let keys = Object.keys(query).sort();
//     for (let i = keys.length - 1; i >= 0; i--) {
//       let key = keys[i];
//       if (query[key] === null || query[key] === undefined) {
//         delete query[key];
//       } else {
//         query[key] = query[key].toString();
//       }
//       if (key != "app_sign") {
//         sign[key] = query[key];
//       }
//     }
//   }
//   if (body && JSON.stringify(body) !== "{}") {
//     let signKey = Object.keys(body).sort();
//     let tempBody = JSON.parse(stringify(body));
//     signKey.forEach(v => {
//       if (
//         tempBody[v] == null ||
//         tempBody[v] === undefined ||
//         tempBody[v] === ""
//       ) {
//         delete tempBody[v];
//       }
//     });
//     let datas = fliterObjs(tempBody);
//     config.data = datas;
//     sign.payload = stringify(datas);
//   }
//   let signStr = "";
//   let signKey = Object.keys(sign).sort();
//   signKey.forEach(key => {
//     if (sign[key]) {
//       signStr += key + "=" + sign[key] + "&";
//     }
//   });
//   signStr = signStr.substring(0, signStr.length - 1);
//   // signStr = CryptoJS.enc.Utf8.parse(signStr).toString()
//   signStr = CryptoJS.MD5(signStr).toString();

//   sign["Dahuange-User-Access-App-Sign"] = CryptoJS.HmacSHA1(
//     signStr,
//     appSecret
//   ).toString();

//   if (sign.payload) {
//     delete sign.payload;
//   }
//   let signOptions = {
//     "Dahuange-User-Access-App-Id": appid,
//     "Dahuange-User-Access-App-Nonce": nonce,
//     "Dahuange-User-Access-App-Timestrap": timestrap,
//     "Dahuange-User-Access-App-Sign": sign["Dahuange-User-Access-App-Sign"]
//   };
//   return signOptions;
// };
// export default getSin;
