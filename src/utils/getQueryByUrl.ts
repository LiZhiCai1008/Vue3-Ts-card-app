
import qs from 'qs'
export const getQueryStringByUrl = function (): Promise<any> {
  // localhost:8081/redirect?cardId=24724209&appId=wx934b0bac6cb081e8&orgId=0162&code=001p8fml22euc74ZiAml2sQ8nK2p8fmu&state=Home#/redirect
  let query = {};
  let search = location.search || ""
  if (search.startsWith("?")) {
    search = search.substr(1)
  }
  query = qs.parse(search)
  return new Promise((resolve) => {
    resolve(query)
  })
};
