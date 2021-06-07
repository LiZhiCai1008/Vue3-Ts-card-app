// import sign from "./sign";
// /**
//  *
//  * @param {*} type
//  */
// export default function getSignOptions(type, config = {}) {
//   let appSecret = "";
//   if (process.env.ENV == "production" || process.env.ENV == "preprod") {
//     appSecret = "ABC_LASSAOW_OLPAWQS*_9981";
//   } else {
//     appSecret = "DheL!234";
//   }
//   let appId = type;
//   let signOptions = sign(appId, appSecret, config);
//   return signOptions;
// }
