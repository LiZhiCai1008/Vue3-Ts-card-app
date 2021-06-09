
// export const getQueryStringByUrl = function (): Promise<T> {
//   // http://localhost:9090/?code=021lCSFa162Y2B0btcGa1thC3c4lCSFd&state=#/redirect?cardId=64269721&orgId=0124
//   let query = {};
//   let href = location.href;
//   console.log("=====herf======", href);
//   let urls = href.split("#"); // 路由模式为hash
//   // console.log(urls, "urls");
//   urls.forEach(url => {
//     let querystr = url.split("?")[1];
//     if (!querystr) return;
//     let querys = querystr.split("&") || [];
//     querys.forEach(_q => {
//       try {
//         let keys = _q.split("=");
//         query[keys[0]] = decodeURIComponent(keys[1]);
//       } catch (error) {
//         console.log("error");
//       }
//     });
//   });
//   console.log("query==========", query);
//   return new Promise((resolve, reject) => {
//     if (query) {
//       resolve(query)
//     } else {
//       reject(false)
//     }
//   });
// };
