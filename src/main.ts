import '@/assets/css/index.scss'
import '@/assets/iconfont/iconfont.css'
import { createApp } from 'vue'
import Page from '@/components/Page.vue'
import 'lib-flexible'
import 'nprogress/nprogress.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import VConsole from "vconsole"
import App from './App.vue'
import router from './router'
import store from './store'

console.log("当前环境变量-------------->", process.env.VUE_APP_ENV)
console.log("当前接口地址-------------->", process.env.VUE_APP_BASE_API)
// 控制台
if (process.env.VUE_APP_ENV !== "development") {
  new VConsole()
}
const app = createApp(App)
// Vue.prototype
app.config.globalProperties.isEmpty = (value: unknown):boolean => {
  const tempValue = JSON.stringify(value),
    emptys = ["", "undefined", "null", "[]", "{}"]
  return emptys.includes(tempValue)
}
app.config.globalProperties.$appId = "RECHARGE_CARD_CONSUMER"
app.config.globalProperties.$baseImg = "http://lerke.oss-cn-shenzhen.aliyuncs.com/"

app.component("Page", Page)
app.use(store)
app.use(router)
app.use(Vant)
app.mount('#app')