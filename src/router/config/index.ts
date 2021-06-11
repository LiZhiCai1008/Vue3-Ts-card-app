import card from "./card"
import { RouteRecordRaw } from "vue-router"
const route: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    name: 'Redirect',
    meta: {
      title: '跳转中',
    },
    component: () =>
      import(/* webpackChunkName: "redirect" */ '@/views/redirect.vue'),
  },
  ...card
]
export default {
  title: "card",
  route
}