/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'nprogress'
declare module 'crypto-js'
declare module 'json-stable-stringify'

declare var wx: any;
declare var WeixinJSBridge: any;