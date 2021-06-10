/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const User = () => import("@/views/user/index.vue");
const CardList = () => import("@/views/bind/cardList.vue");
export default [
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '个人中心'
    },
    component: User
  },
  {
    path: '/card/bind',
    name: 'CardBind',
    meta: {
      title: '绑定储值卡'
    },
    // route level code-splitting
    // this generates a separate chunk (bind.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "bind" */ '@/views/bind/index.vue')
  },
  {
    path: '/phone/change',
    name: 'ChangePhone',
    meta: {
      title: '更换手机号'
    },
    component: () => import(/* webpackChunkName: "phone" */ '@/views/bind/change-phone.vue')
  },
  {
    path: '/card/list',
    name: 'CardList',
    meta: {
      title: '储值卡列表'
    },
    component: CardList
  },
  {
    path: '/card/buy-limit',
    name: 'BuyLimit',
    meta: {
      title: '购买限制'
    },
    component: () => import(/* webpackChunkName: "limit" */ '@/views/card/buy-limit.vue')
  },
  {
    path: '/recharge',
    name: 'Recharge',
    meta: {
      title: '充值'
    },
    component: () => import(/* webpackChunkName: "recharge" */ '@/views/recharge/index.vue')
  },
  {
    path: '/recharge/record',
    name: 'RechargeRecord',
    meta: {
      title: '交易记录'
    },
    component: () => import(/* webpackChunkName: "record" */ '@/views/recharge/record.vue')
  },
  {
    path: '/error',
    name: 'Error',
    meta: {
      title: '出错误啦'
    },
    component: () => import(/* webpackChunkName: "error" */ '@/views/error/index.vue')
  }
]
