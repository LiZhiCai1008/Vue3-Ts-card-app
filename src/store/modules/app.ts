import router from '@/router/index'
type State = {
  isPopShow: boolean,
  orgId: string | number,
  appId: string | number,
  findFlag: boolean
}
export default {
  namespaced: true,
  state: {
    isPopShow: false,
    orgId: "",
    appId: "",
    findFlag: true
  },
  mutations: {
    SET_POP_SHOW(state: State, payload: boolean): void {
      state.isPopShow = payload
    },
    SET_ORG_ID(state: State, payload: string | number): void {
      localStorage.setItem("ORG_ID", payload.toString())
      state.orgId = payload
    },
    SET_WX_APP_ID(state: State, payload: string | number): void {
      localStorage.setItem("WX_APP_ID", payload.toString())
      state.appId = payload
    },
    SET_FIND_FLAG(state: State, payload: boolean): void{
      state.findFlag = payload
    }
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    resetToLogin(ctx: any, payload?: any): void {
      ctx.commit("SET_FIND_FLAG", false) // 不需要查询当前手机号
      console.log(ctx.rootState, payload)
      router.replace({
        name: "Redirect",
        query: {
          cardId: localStorage.getItem("CARD_ID"),
          cardNo: ctx.rootState.card.cardInfo.cardNo,
          serialNo: ctx.rootState.card.cardInfo.serialNo,
          orgId: localStorage.getItem("ORG_ID")
        }
      })
    }
  },
  getters: {}
}