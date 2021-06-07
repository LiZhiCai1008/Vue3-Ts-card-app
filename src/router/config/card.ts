export default [
  {
    path: '/card/list',
    name: 'CardList',
    meta: {
      title: '储值卡列表'
    },
    component: (): unknown => import(/* webpackChunkName: "list" */ '@/views/bind/card-list.vue')
  }
]
