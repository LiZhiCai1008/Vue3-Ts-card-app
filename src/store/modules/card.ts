/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CardService } from '@/api/card'
import router from '@/router/index'
// import { amountFmt } from '@/utils/filter'
import { GetCardInfoParams } from "@/api/types/Card"
import { Card } from "@/types/Card.d"
type State = {
  cardId: string,
  cardList: Card[],
  cardInfo: any
}
export default {
  namespaced: true,
  state: {
    cardId: "",
    cardList: [],
    cardInfo: {
      cardNo: "",
      serialNo: ""
    }
  },
  mutations: {
    SET_CARD_INFO(state: State, payload: any): void {
      localStorage.setItem("CARD_INFO", JSON.stringify(payload))
      state.cardInfo = payload
    },
    SET_CARD_LIST(state: State, payload: Card[]): void {
      localStorage.setItem("CARD_LIST", JSON.stringify(payload))
      state.cardList = payload
    },
    SET_CARD_ID(state: State, payload: string): void {
      localStorage.setItem("CARD_ID", payload)
      state.cardId = payload
    },
  },
  actions: {
    // 设置卡信息
    setCardInfo(ctx: any, payload: Card): void {
      ctx.commit("SET_CARD_INFO", payload)
    },
    // 获取卡信息
    /*
    * payload undefined || { check: true } || { cardNo, serialNo }
    * undefined || { check: true } 使用state中的cardNo和serialNo
    * { cardNo, serialNo } 使用参数payload中的cardNo和serialNo
    */
    async getCardInfoAction(ctx: any, payload: any) {
      console.log(payload, "-----------")
      try {
        const localMember: string = localStorage.getItem("MEMBER_INFO") || ""
        const memberInfo = JSON.parse(localMember)
        let params: GetCardInfoParams = {
          phone: memberInfo.phone,
          orgId: localStorage.getItem("ORG_ID") || "",
          cardNo: "",
          serialNo: "",
          cardId: ""
        }
        if (!payload || payload.check) {
          params = {
            ...params,
            cardNo: ctx.state.cardInfo.cardNo,
            serialNo: ctx.state.cardInfo.serialNo,
            cardId: ctx.state.cardInfo.cardId
          }
        } else {
          params = {
            ...params,
            cardNo: payload.cardNo,
            serialNo: payload.serialNo,
            cardId: payload.cardId
          }
        }
        const { data } = await CardService.getCardInfoApi({
          ...params
        })
        if (data.code === 200) {
          ctx.dispatch("setCardInfo", {
            ...data.content
          })
        }
        // 是否判断status
        if (payload && payload.check) {
          ctx.dispatch("checkPageTo", data.content.belongStatus)
        }
        return data
      } catch (error) {
        console.log(error)
        if (payload && payload.check) {
          ctx.dispatch("checkPageTo", -1)
        }
        return false
      }
    },
    // 判断是否是当前卡
    checkPageTo(ctx: any, status: number): void {
      console.log("cardInfo status", status)
      if (status === 0 || status === 2) {
        router.replace({
          name: "CardList",
          query: {
            status
          }
        })
      } else if (status === 1) {
        router.replace({
          name: "User"
        })
      } else {
        router.replace({
          name: "CardList",
          query: {
            status: -1
          }
        })
      }
    },
    // 获取卡列表
    async getCardListAction(ctx: any) {
      try {
        const localMember: string = localStorage.getItem("MEMBER_INFO") || ""
        const memberInfo = JSON.parse(localMember)
        const { data } = await CardService.getUserCardListApi({
          phone: memberInfo.phone,
          orgId: localStorage.getItem("ORG_ID") || ""
        })
        if (data.code === 200) {
          console.log(data.content)
          ctx.commit("SET_CARD_LIST", data.content || [])
          return data
        } else {
          return {}
        }
      } catch (error) {
        console.log(error)
        return error
      }
    }
  },
  getters: {
    menuList(state: State) {
      const menus = [
        {
          name: '购买限制',
          icon: 'icongoumaixianzhi',
          urlName: 'BuyLimit',
          query: {},
          auth: state.cardInfo.status != 2
        },
        {
          name: '交易记录',
          icon: 'iconjiaoyijilu',
          urlName: 'RechargeRecord',
          query: {},
          auth: true
        },
        {
          name: '取消挂失',
          icon: 'iconjieguashi',
          urlName: 1,
          auth: state.cardInfo.status == 3
        },
        {
          name: '取消补卡',
          icon: 'iconbuka',
          urlName: 2,
          auth: state.cardInfo.status == 4
        },
        {
          name: '挂失',
          icon: 'iconguahi',
          urlName: 3,
          auth: state.cardInfo.status != 3 && state.cardInfo.status != 2
        },
        {
          name: '补卡',
          icon: 'iconbuka',
          urlName: 4,
          auth: state.cardInfo.status != 4 && state.cardInfo.status != 2
        },
        {
          name: '联系客服',
          icon: 'iconkefu',
          urlName: 9,
          auth: state.cardInfo.status != 2
        },
        {
          name: '切换卡片',
          icon: 'iconkapianxinxi',
          urlName: 'CardList',
          query: { status: state.cardInfo.belongStatus },
          auth: true
        }
      ]
      return menus.filter(m => {
        return m.auth
      })
    },
    messageBox(state: State) {
      return {
        1: { title: '确定取消挂失', message: '取消挂失后，储值卡可正常购买，卡片遗失后建议申请补卡~' },
        2: { title: '确定取消补卡', message: '取消补卡后，储值卡可正常购买，卡片遗失后建议申请补卡~' },
        3: { title: '确定挂失', message: '挂失后，将无法刷卡购买' },
        // 4: { title: '确定申请补卡', message: `补卡将扣除${amountFmt(state.cardInfo.productionCost || 0)}元工本费~` }
      }
    }
  }
}