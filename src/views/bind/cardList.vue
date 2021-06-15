<template>
  <Page isHeader>
    <div class="content lk-p-b-60">
      <!-- 暂未绑定储值卡 -->
      <div v-show="status == 0" class="no-card">
        <van-image
          width="120"
          height="120"
          :src="require('@/assets/images/ic_no_bind.svg')"
        />
        <p class="no-card-tips font-1 lk-m-t-16">暂未绑定储值卡</p>
        <van-button
          class="lk-m-t-60 font-1"
          color="#F8B500"
          block
          round
          @click="handleClickBind"
        >绑定储值卡</van-button>
        <div class="bind-other-card lk-m-b-20 lk-m-t-20 content" @click="handleClickChangePhonePop">切换手机号</div>
      </div>
      <!-- 当前卡绑定其他手机号 -->
      <div v-show="status == 2" class="has-bind no-card">
        <van-image
          width="120"
          height="120"
          :src="require('@/assets/images/ic_has_bind.png')"
        />
        <p class="no-card-tips font-1 lk-m-t-16">当前卡片已绑定其他手机号</p>
        <van-button
          class="lk-m-t-60 font-1"
          color="#F8B500"
          block
          round
          @click="handleClickChangePhone"
        >更换手机号</van-button>
      </div>
      <!-- 已经绑定储值卡 -->
      <div v-show="status == 1" class="card-box-wrap">
        <!-- 绑定多张当前手机号的储值卡 -->
        <p class="lk-m-t-12">选择卡片</p>
        <!-- 卡信息 -->
        <div
          v-for="card in cardList"
          :key="card.serialNo"
          :style="{
            backgroundImage: 'url(' + baseImg + (card.coverUrl || 'photo/h5C/card/card_default.png') + ')'
          }"
          class="card-box content lk-relative lk-m-t-12"
          @click="handleToDetail(card)"
        >
          <div class="card-info lk-flex lk-m-t-12">
            <van-image
              round
              width="36"
              height="36"
              :src="baseImg + card.cardLogo || 'photo/h5C/card/card_logo.png'"
            />
            <span class="info lk-font-16 van-ellipsis">{{ card.cardName }}</span>
          </div>
          <p class="card-num lk-absolute lk-font-14">
            卡号：<span>{{  NumberCut(card.cardNo || "") }}</span>
          </p>
        </div>
        <!-- 绑定其他卡片 -->
        <div class="bind-other-card lk-m-t-20 content" @click="handleClickBind">绑定其他储值卡</div>
      </div>
    </div>
    <Popup
      :visible="isPopShow"
      title="储值卡使用协议"
    >
      <template v-slot:content>
        <p class="agreement-content">
          1、储值卡内的金额只能在指定售货机购买，不能抵其他消费，可咨询发卡方了解详情。<br>
          2、应妥善保管储值卡，如因将卡转交其他人、遗失等情况，造成卡片被复制，产生的风险由用户自行承担。<br>
          3、储值卡遗失后，可自行挂失，挂失成功后，可立即办理补卡手续，同时需交补卡费，原卡号内的金额将转入新卡，同时旧卡作废。<br>
          4、若您以非法、欺诈或利用本平台漏洞的方式使用储值卡，本平台有权随时终止您使用储值卡在本平台购买。
        </p>
      </template>
      <template v-slot:footer class="content">
        <van-button
          class="lk-m-t-16 font-1"
          color="#F8B500"
          block
          round
          @click="handleClickApply"
        >同意协议</van-button>
      </template>
    </Popup>
  </Page>
</template>

<script lang="ts">
import Popup from '@/components/Popups.vue'
import { defineComponent, computed, reactive, toRefs, getCurrentInstance, onActivated } from "vue";
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Dialog } from 'vant'
import { NumberCut } from '@/utils/format'
import { FormatType } from '@/types/Card.d'
export default defineComponent({
  name: "CardList",
  components: {
    Popup
  },
  setup() {
    // 创建全局上下文
    const app = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    // 创建仓库
    const store = useStore()

    const state = reactive<{ status: number, NumberCut: FormatType }>({
      status: 0,
      NumberCut
    })

    onActivated(async () => {
      console.log("onActivated")
      state.status = Number(route.query.status || 0)
      if (state.status === 1) {
        // 切换卡，多张卡
        const res = await store.dispatch("card/getCardListAction")
        console.log(res, "---------------")
        if (res && !res.length) {
          state.status = 0
        }
        console.log(state.status, typeof state.status)
      }
      if (state.status === -1) {
        console.log('===========回到redirect重新校验', 1)
        // this.resetToLogin()
        store.dispatch("app/resetToLogin")
        console.log('===========回到redirect重新校验', 3)
        return false
      }
      if(!localStorage.getItem('routeFlag')){
         localStorage.setItem('routeFlag','true')
        window.location.reload()
      }
    })
    const baseImg = app && app.appContext.config.globalProperties.$baseImg

    const isPopShow = computed(() => store.state.app.isPopShow)
    const cardList = computed(() => store.state.card.cardList)

    const handleClickApply = (): void => {
      store.commit("app/SET_POP_SHOW", false)
      router.push({
        name: "CardBind"
      })
    }

    const handleClickBind = async (): Promise<void> => {
      store.commit("app/SET_POP_SHOW", true)
    }

    const handleToDetail = (card: any): void => {
      console.log("card", card)
      router.push({
        name: "User",
        query: {
          cardNo: card.cardNo,
          serialNo: card.serialNo
        }
      })
    }

    const handleClickChangePhonePop = (): void => {
      Dialog.confirm({
        title: "确认切换手机号?",
        message: "切换手机号需要重新登录",
        confirmButtonColor: '#F8B500'
      }).then(() => {
        console.log("确定")
        store.dispatch("app/resetToLogin")
      }).catch(() => {
        console.log("error")
      })
    }

    const handleClickChangePhone = ():void => {
      router.push({
        name: "ChangePhone"
      })
    }

    return {
      ...toRefs(state),
      isPopShow,
      cardList,
      baseImg,
      handleClickBind,
      handleClickApply,
      handleToDetail,
      handleClickChangePhonePop,
      handleClickChangePhone
    }
  }
})
</script>

<style lang="scss" scoped>
  .no-card {
    margin-top: 120px;
    text-align: center;
    .no-card-tips {
      font-size: 18px;
      font-weight: 500;
      line-height: 18px;
    }
  }
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
  .agreement-content {
    line-height: 24px;
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