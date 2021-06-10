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
          <MsgCode :phone="login.phone" type="ACTIVITY_SMS_SEND" template-code="ACTIVITY_SMS_SEND" @success="onSuccess" />
        </template>
      </van-field>
      <van-button class="pop-login" :loading="loading" round @click.native.stop="handleConfirmBind">登录</van-button>
    </div>
  </van-popup>
</template>

<script>
import { Toast } from 'vant';
import { decode } from 'js-base64';
import MsgCode from '@/components/Msgcode.vue'
import { getWeixinOpenIdApi, getBindByOpenidApi, bindMemberApi } from '@/api/entery'
import { getQueryStringByUrl } from '@/utils/getQueryByUrl'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: "Redirect",
  components: {
    MsgCode
  },
  data() {
    return {
      toast: null,
      showLogin: false,
      loading: false,
      openId: "",
      code: "",
      cardInfo: {
        cardNo: "", // 扫码进入时传参
        serialNo: "", // 扫码进入时传参
        cardId: "" // 公众号菜单进入时传参
      },
      login: {
        phone: "",
        phoneCode: ""
      }
    };
  },
  beforeRouteEnter (to, from, next) {
    const OPEN_ID = localStorage.getItem("OPEN_ID")
    // ...扫码或者公众号菜单进入
    next(async vm => {
      vm.showLogin = false
      vm.toast = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      vm.cardInfo = {}
      // 处理参数
      vm.cardInfo = await getQueryStringByUrl()
      console.log("...扫码或者公众号菜单进入", vm.cardInfo)
      vm.code = vm.cardInfo.code
      await vm.SET_ORG_ID(vm.cardInfo.orgId || "")
      await vm.SET_CARD_ID(vm.cardInfo.cardId || "")
      await vm.SET_WX_APP_ID(vm.cardInfo.appId || "")
      vm.cardInfo.code && delete vm.cardInfo.code
      vm.cardInfo.state && delete vm.cardInfo.state
      vm.cardInfo.appId && delete vm.cardInfo.appId
      vm.setCardInfo(vm.cardInfo)
      if (OPEN_ID) {
        vm.openId = OPEN_ID
      } else {
        await vm.getWxOpenIdAction()
      }
      await vm.getBindInfoAction()
    })
  },
  computed: {
    ...mapState("app", ["findFlag", "orgId"])
  },
  methods: {
    ...mapMutations("app", ["SET_ORG_ID", "SET_WX_APP_ID"]),
    ...mapMutations("card", ["SET_CARD_ID"]),
    ...mapActions("entery", ["setMemberInfo"]),
    ...mapActions("card", ["setCardInfo", "getCardInfoAction"]),
    async getWxOpenIdAction() {
      const { code, content } = await getWeixinOpenIdApi({
        code: this.code,
        appId: this.$appId,
        orgId: this.orgId || localStorage.getItem("ORG_ID")
      })
      console.log(code, content)
      if (code === 200) {
        this.openId = decode(content.thirdUserId);
        localStorage.setItem("OPEN_ID", this.openId)
      }
    },
    async getBindInfoAction() {
      console.log(this.findFlag)
      const { code, content } = await getBindByOpenidApi({
        openId: this.openId,
        findFlag: this.findFlag
      })
      if (code === 200) {
        content && await this.setMemberInfo(content)
        if (!content.memberNo || !content.phone) {
          this.loading = false
          this.toast.clear()
          this.showLogin = true
          return false
        }
        this.handlePageToDetail(true)
      }
    },
    async handleConfirmBind() {
      this.loading = true
      if (!this.login.phone || !this.login.phoneCode) {
        this.$toast("请正确填写")
        this.loading = false
        return false
      }
      try {
        const { code, content } = await bindMemberApi({
        ...this.login,
        openId: this.openId,
        scanAppName: "weixin",
        appId: localStorage.getItem("WX_APP_ID") || "" // 微信公众号appId
      })
      if (code === 200) {
        console.log(content)
        content && await this.setMemberInfo(content)
        this.$toast("登录成功")
        this.handlePageToCardList() // 如果要登录，则跳转列表页面
        this.loading = false
        this.showLogin = false
      } else {
        this.loading = false
      }
      } catch (error) {
        this.loading = false
      }
    },
    // 跳转详情
    async handlePageToDetail(loading) {
      console.log(loading, this.getCardInfoAction)
      try {
        await this.getCardInfoAction({ check: true })
        if (loading) {
          this.toast.clear()
        }
      } catch (error) {
        console.log(error)
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });
      }
    },
    handlePageToCardList() {
      // 列表展示
      localStorage.removeItem('routeFlag')
      this.$router.replace({
        name: "CardList",
        query: {
          status: 1
        }
      })
    },
    onSuccess() {
      console.log("发送成功")
    },
    blur() {
      setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        console.log("blur", scrollHeight)
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
  },
}
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