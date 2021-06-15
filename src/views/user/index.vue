<template>
  <Page isHeader bg="#ffffff">
    <div class="content">
      <!-- 卡信息 -->
      <div
        :style="{
          backgroundImage: 'url(' + baseImg + (cardInfo.coverUrl || 'photo/h5C/card/card_default.png') + ')'
        }"
        class="card-box content lk-relative lk-m-t-12">
        <div class="card-info lk-flex lk-m-t-12">
          <van-image
            round
            width="36"
            height="36"
            :src="baseImg + (cardInfo.cardLogo || 'photo/h5C/card/card_logo.png')"
          />
          <span class="info lk-font-16 van-ellipsis">{{ cardInfo.cardName }}</span>
        </div>
        <div class="card-status lk-absolute">
          {{ statusFmt(cardInfo.status || 0) }}
        </div>
        <p class="card-num lk-absolute lk-font-14">
          卡号：<span>{{  NumberCut(cardInfo.cardNo || "") }}</span>
        </p>
      </div>
      <!-- 余额显示 -->
      <div class="balance-box lk-m-t-16 lk-p-l-12 lk-p-r-12">
        <p class="font-3 lk-font-12 lk-m-b-4">余额/元</p>
        <div class="lk-flex lk-row-between">
          <span class="font-1 lk-font-24 van-ellipsis">{{ amountFmt(cardInfo.totalAmount) }}</span>
          <div
            :class="{ disabled: cardInfo.status !== 1 }"
            class="recharge-btn font-1"
            @click="handleToRecharge"
          >
            充值
          </div>
        </div>
      </div>
      <!-- 菜单栏 -->
      <div class="lk-m-t-35 lk-p-b-20">
        <van-cell
          center
          is-link
          v-for="(menu, idx) in menuList"
          :key="idx"
          @click="handleClickMenu(menu)"
        >
          <template #icon>
            <i class="icon iconfont lk-font-24" :class="[menu.icon]" />
          </template>
          <template #title>
            <div class="lk-font-16 font-1 lk-m-l-16">{{ menu.name }}</div>
          </template>
        </van-cell>
      </div>
      <div class="bind-other-card lk-m-b-20 content" @click="handleClickChangePhone">切换手机号</div>
    </div>
  </Page>
</template>

<script lang="ts">
import { NumberCut } from '@/utils/format'
import { amountFmt, statusFmt } from '@/utils/filter'
import { FormatType } from '@/types/Card'
import { CardService } from '@/api/card'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, onActivated, reactive, toRefs, computed, getCurrentInstance } from 'vue'
export default defineComponent({
  name: "User",
  components: {},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive<{ NumberCut: FormatType, amountFmt: FormatType, statusFmt: FormatType }>({
      NumberCut,
      statusFmt,
      amountFmt
    })
    // 创建全局上下文
    const app = getCurrentInstance()
    const baseImg = app && app.appContext.config.globalProperties.$baseImg
    onActivated(() => {
      const { cardNo, serialNo } = route.query
      if (cardNo && serialNo) {
        store.dispatch("card/getCardInfoAction", { cardNo, serialNo })
      } else {
        store.dispatch("card/getCardInfoAction")
      }
    })
    const cardInfo = computed(() => store.state.card.cardInfo)
    const menuList = computed(() => store.getters['card/menuList'])
    const messageBox = computed(() => store.getters['card/messageBox'])
    

    const handleClickMenu = (n: any): void => {
      console.log(n)
      if (typeof n.urlName === "number") {
        let idx = n.urlName
        console.log(idx)
        if (idx == 9) {
          console.log('打电话')
          window.location.href = `tel://${cardInfo.value.servicePhone}`
          return
        }
        Dialog.confirm({
          title: messageBox.value[idx].title,
          message: messageBox.value[idx].message,
          confirmButtonColor: '#F8B500'
        }).then(() => {
          updateStatusAction(idx)
        }).catch(() => {console.log()})
      } else {
        router.push({
          name: n.urlName,
          query: n.query
        })
      }
    }
    const updateStatusAction = async (idx: number): Promise<any> => {
      // idx 1：正常（取消补卡 2，取消挂失）3：挂失 4：补卡
      try {
        const { data } = await CardService.updateCardStatusApi({
          status: idx == 2 ? 1 : idx, // idx = 2的时候是取消补卡状态，但是后端都需要传1
          cardNo: cardInfo.value.cardNo,
          serialNo: cardInfo.value.serialNo
        })
        if (data.code === 200) {
          let text = ["", "取消挂失成功", "取消补卡成功", "挂失成功", "申请补卡成功"]
          Toast(text[idx])
          store.dispatch("card/getCardInfoAction")
        }
      } catch (error) {
        console.log(error)
      }
    }
    const handleToRecharge = (): void => {
      if (cardInfo.value.status !== 1) {
        Toast("当前储值卡处于非正常状态")
        return
      }
      router.push({
        name: "Recharge"
      })
    }
    const handleClickChangePhone = (): void => {
      Dialog.confirm({
        title: "确认切换手机号?",
        message: "切换手机号需要重新登录",
        confirmButtonColor: '#F8B500'
      }).then(() => {
        store.dispatch("app/resetToLogin")
      }).catch(() => {console.log()})
    }
    return {
      ...toRefs(state),
      handleClickMenu,
      handleToRecharge,
      menuList,
      cardInfo,
      handleClickChangePhone,
      baseImg
    }
  }
})
</script>

<style lang="scss" scoped>
.card-box {
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 210px;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
  .card-info {
    margin: 12px 0;
    padding: 12px 0;
    .info {
      flex: 1;
      display: inline-block;
      margin-left: 12px;
      font-weight: 500;
      color: #fff;
    }
  }
  .card-status {
    top: 10px;
    right: 0;
    background-color: #F56C6C;
    color: #fff;
    font-size: 12px;
    border-radius: 10px 0 0 10px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    text-align: center;
  }
  .card-num {
    left: 12px;
    bottom: 24px;
    color: #fff;
  }
}
.balance-box {
  .recharge-btn {
    width: 64px;
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    background-color: #F8B500;
    border-radius: 12px;
  }
  .disabled {
    opacity: 0.5;
  }
}
.bind-other-card {
  width: 100%;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #F8B500;
  line-height: 40px;
  text-align: center;
  box-sizing: border-box;
}
</style>