import sign from "./sign";
import { SignType } from '@/types/Response.d'
import { AxiosRequestConfig } from 'axios'
/**
 *
 * @param {*} type
 */
export default (type: string, config: AxiosRequestConfig = {}): SignType => {
  let appSecret = "";
  if (process.env.VUE_APP_ENV == "production" || process.env.VUE_APP_ENV == "preprod") {
    appSecret = "y8Bz0ftyymo2@3mg";
  } else {
    appSecret = "DheL!234";
  }
  const appId = type;
  const signOptions: SignType = sign(appId, appSecret, config);
  return signOptions;
}
