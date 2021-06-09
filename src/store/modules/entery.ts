import router from '@/router'
export default {
  namespaced: true,
  state: {
    isPopShow: false,
    orgId: "",
    appId: "",
    findFlag: true
  },
  mutations: {
    SET_POP_SHOW(state, payload) {
      state.isPopShow = payload
    },
    SET_ORG_ID(state, payload) {
      localStorage.setItem("ORG_ID", payload)
      state.orgId = payload
    },
    SET_WX_APP_ID(state, payload) {
      localStorage.setItem("WX_APP_ID", payload)
      state.appId = payload
    },
    SET_FIND_FLAG(state, payload) {
      state.findFlag = payload
    }
  },
  actions: {
    resetToLogin({ rootState, commit }, payload) {
      commit("SET_FIND_FLAG", false) // 不需要查询当前手机号
      console.log(rootState, payload)
      router.replace({
        name: "Redirect",
        query: {
          cardId: localStorage.getItem("CARD_ID"),
          cardNo: rootState.card.cardInfo.cardNo,
          serialNo: rootState.card.cardInfo.serialNo,
          orgId: localStorage.getItem("ORG_ID")
        }
      })
    }
  },
  getters: {}
}