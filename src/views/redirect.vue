<template>
  <van-popup
    v-model="showLogin"
    :close-on-click-overlay="false"
    round
  >
    <div class="pop-content">
      <p class="lk-font-18 lk-text-center lk-p-t-10 lk-p-b-10 font-1">登录绑定</p>
      <van-field
        class="login-field"
        v-model="login.phone"
        type="digit"
        label="手机号"
        maxlength="11"
        @blur="blur"
      />
      <van-field
        class="login-field"
        v-model="login.phoneCode"
        type="digit"
        label="验证码"
        maxlength="6"
        @blur="blur"
      >
        <template #button>
          <MsgCode :phone="login.phone" type="ACTIVITY_SMS_SEND" template-code="ACTIVITY_SMS_SEND" />
        </template>
      </van-field>
      <van-button class="pop-login" :loading="loading" round @click.stop="handleConfirmBind">登录</van-button>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { Toast } from 'vant';
import { decode } from 'js-base64';
import MsgCode from '@/components/Msgcode.vue'
import { EnteryService } from '@/api/entery'
import { getQueryStringByUrl } from '@/utils/getQueryByUrl'
import { useStore } from 'vuex'
import { defineComponent, reactive, toRefs, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "Redirect",
  components: {
    MsgCode
  },
  setup() {
    const app = getCurrentInstance()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      showLogin: false,
      loading: false,
      openId: "",
      code: "",
      cardInfo: {
        code: "",
        orgId:"",
        state: "",
        appId: "",
        cardId: ""
      },
      login: {
        phone: "",
        phoneCode: ""
      }
    })
    const toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    const firstEnterInitFun = async (): Promise<any> => {
      try {
        const OPEN_ID = localStorage.getItem("OPEN_ID")
        console.log("OPENID-------------", OPEN_ID)
        state.showLogin = false
        state.cardInfo = {
          code: "",
          orgId:"",
          state: "",
          appId: "",
          cardId: ""
        }
        // 处理参数
        state.cardInfo = await getQueryStringByUrl()
        console.log("...扫码或者公众号菜单进入", state.cardInfo)
        state.code = state.cardInfo.code
        store.commit("app/SET_ORG_ID", state.cardInfo.orgId || "")
        store.commit("card/SET_CARD_ID", state.cardInfo.cardId || "")
        store.commit("app/SET_WX_APP_ID", state.cardInfo.appId || "")
        // state.cardInfo.code && delete state.cardInfo.code
        // state.cardInfo.state && delete state.cardInfo.state
        // state.cardInfo.appId && delete state.cardInfo.appId
        store.dispatch("card/setCardInfo", state.cardInfo)
        if (OPEN_ID) {
          state.openId = OPEN_ID
        } else {
          await getWxOpenIdAction()
        }
        await getBindInfoAction()
      } catch (error) {
        console.log(error, "---------------------------")
        toast.value = Toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })
      }
    }
    firstEnterInitFun()
    const findFlag = computed(() => store.state.app.findFlag)
    const orgId = computed(() => store.state.app.orgId)
    const appId = app && app.appContext.config.globalProperties.$appId
    const getWxOpenIdAction = async (): Promise<any> => {
      const { data } = await EnteryService.getWeixinOpenIdApi({
        code: state.code,
        appId: appId,
        orgId: orgId.value || localStorage.getItem("ORG_ID")
      })
      console.log(data.code, data.content)
      if (data.code === 200) {
        state.openId = decode(data.content.thirdUserId);
        localStorage.setItem("OPEN_ID", state.openId)
      }
    }
    const getBindInfoAction = async (): Promise<any> => {
      console.log(findFlag.value)
      const { data } = await EnteryService.getBindByOpenidApi({
        openId: state.openId,
        findFlag: findFlag.value
      })
      if (data.code === 200) {
        data.content && await store.dispatch("entery/setMemberInfo", data.content)
        if (!data.content.memberNo || !data.content.phone) {
          state.loading = false
          toast.clear()
          state.showLogin = true
          return false
        }
        handlePageToDetail(true)
      }
    }
    const handleConfirmBind = async (): Promise<any> => {
      state.loading = true
      if (!state.login.phone || !state.login.phoneCode) {
        Toast("请正确填写")
        state.loading = false
        return false
      }
      try {
        const { data } = await EnteryService.bindMemberApi({
        ...state.login,
        openId: state.openId,
        scanAppName: "weixin",
        appId: localStorage.getItem("WX_APP_ID") || "" // 微信公众号appId
      })
      if (data.code === 200) {
        console.log(data.content)
        data.content && await store.dispatch("entery/setMemberInfo", data.content)
        Toast("登录成功")
        handlePageToCardList() // 如果要登录，则跳转列表页面
        state.loading = false
        state.showLogin = false
      } else {
        state.loading = false
      }
      } catch (error) {
        state.loading = false
      }
    }
    // 跳转详情
    const handlePageToDetail = async (loading: boolean): Promise<any> => {
      console.log(loading)
      try {
        await store.dispatch("card/getCardInfoAction", { check: true })
        if (loading) {
          toast.clear()
        }
      } catch (error) {
        console.log(error)
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });
      }
    }
    const handlePageToCardList = (): void => {
      // 列表展示
      localStorage.removeItem('routeFlag')
      router.replace({
        name: "CardList",
        query: {
          status: 1
        }
      })
    }
    const blur = (): void => {
      setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        console.log("blur", scrollHeight)
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
    return {
      ...toRefs(state),
      getWxOpenIdAction,
      handleConfirmBind,
      blur
    }
  }
})
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.login-field ::v-deep .van-field__label {
  width: 1.6rem;
}
.pop-content {
  width: 70vw;
  padding: 12px;
  .pop-login {
    background-color: #F8B500;
    color: #333333;
    font-size: 16px;
    margin: 12px 0 10px 0;
  }
}

</style>