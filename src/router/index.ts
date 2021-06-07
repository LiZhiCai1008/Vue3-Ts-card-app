import { createRouter, createWebHistory } from 'vue-router'
// import Nprogress from "nprogress"
import NavConfig from "./config"


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: NavConfig.route
})
router.beforeEach((to, form, next) => {
  console.log("跳转之前", to, form)
  // Nprogress.start()
  next()
})
router.afterEach(() => {
  // Nprogress.done()
});
export default router
