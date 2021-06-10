/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { MemberInfo } from '@/types/Card.d'
type State = {
  memberInfo: MemberInfo,
}
export default {
  namespaced: true,
  state: {
    memberInfo: {
      phone: "",
      memberNo: ""
    },
  },
  mutations: {
    SET_MEMBER_INFO(state: State, payload: MemberInfo): void {
      state.memberInfo = payload
    }
  },
  actions: {
    setMemberInfo(ctx: any, payload: MemberInfo): void {
      localStorage.setItem("MEMBER_INFO", JSON.stringify(payload))
      ctx.commit("SET_MEMBER_INFO", payload)
    }
  }
}