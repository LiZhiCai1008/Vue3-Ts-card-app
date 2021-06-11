<template>
  <Page isHeader>
    <div class="bind-form">
      <van-form
        label-width="2rem"
        @submit="handleClickSave"
        @failed="onFailed"
      >
        <van-field
          v-model="bindForm.cardNo"
          :rules="[
            { required: true, message: '请输入实体卡卡号' }
          ]"
          autocomplete="off"
          name="卡号"
          type="number"
          clearable
          label="卡号"
          placeholder="请输入实体卡卡号"
        >
          <template #right-icon>
            <i class="icon iconfont iconsaomiao lk-font-20" @click="handleScanCode" />
          </template>
        </van-field>
        <van-field
          v-model="bindForm.serialNo"
          :rules="[
            { required: true, message: '请输入序列号' }
          ]"
          name="序列号"
          autocomplete="off"
          type="text"
          clearable
          label="序列号"
          placeholder="请输入序列号"
        />
        <van-field
          v-model="bindForm.phone"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: patternPhone, message: '手机号格式错误' }
          ]"
          name="手机号"
          autocomplete="off"
          type="number"
          clearable
          label="手机号"
          maxlength="11"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="bindForm.vcode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          autocomplete="off"
          type="number"
          clearable
          maxlength="6"
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <MsgCode :phone="bindForm.phone" type="RECHARGE_CARD_CHANGE_PHONE_NEW" />
          </template>
        </van-field>
        <!-- <van-field
          v-model="bindForm.orgName"
          name="单位/学校"
          type="text"
          clearable
          label="单位/学校"
          placeholder="请输入单位/学校"
        /> -->
        <van-field
          v-model="bindForm.userName"
          :rules="[
            { required: true, message: '请输入姓名' }
          ]"
          name="姓名"
          autocomplete="off"
          type="text"
          clearable
          label="姓名"
          maxlength="20"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="bindForm.remark"
          name="其他信息"
          autocomplete="off"
          autosize
          show-word-limit
          maxlength="50"
          type="textarea"
          label="其他信息"
          placeholder="请输入其他信息"
        />
        <div class="content defalut-bg">
          <p class="lk-p-t-12 font-3 lk-font-14">如无法扫描卡二维码，请联系管理员获取</p>
          <van-button
            class="font-1 lk-m-t-40 "
            color="#F8B500"
            block
            round
            native-type="submit"
          >绑定储值卡</van-button>
        </div>
      </van-form>
    </div>
  </Page>
</template>

<script lang="ts">
import MsgCode from '@/components/Msgcode.vue'
import { getWxJsConfigAction } from '@/utils/wx-config'
import { BindService } from "@/api/bind"
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { defineComponent, computed, reactive, toRefs } from "vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "Bind",
  components: {
    MsgCode
  },
  setup() {
    const router = useRouter()
    // 创建仓库
    const store = useStore()
    const state = reactive<{ patternPhone: RegExp, bindForm: any }>({
      patternPhone: /^1[3456789]\d{9}$/,
      bindForm: {
        cardNo: "",
        serialNo: "",
        phone: "",
        vcode: "",
        userName: "",
        remark: ""
      }
    })
    const memberInfo = computed(() => store.state.entery.memberInfo)
    // 解析扫码内容
    const parseResult = (str: string): any => {
      // {host}/web/qrcode/recharge/card/1234567890123456/123123
      // {host}/web/qrcode/recharge/card/{cardNo}/{serialNo}
      if (!str) return false
      let resultSplit = str.split("/"),
        length = resultSplit.length
      state.bindForm.cardNo = resultSplit[length - 2]
      state.bindForm.serialNo = resultSplit[length - 1]
    }
    // 点击扫描卡二维码
    const handleScanCode = async (): Promise<any> => {
      if (process.env.VUE_APP_ENV === "development") {
        parseResult("{host}/web/qrcode/recharge/card/1234567890123456/123123")
        return false
      }
      const TOAST = Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      await getWxJsConfigAction()
      // eslint-disable-next-line no-undef
      wx.ready(() => {
        TOAST.clear()
        // eslint-disable-next-line no-undef
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res: any) => {
            if (!res.resultStr) {
              Toast("二维码信息获取为空!")
              return false;
            }
            parseResult(res.resultStr)
          },
          fail: () => {
            Toast("二维码扫描失败!")
          }
        })
      })
    }
    const handleClickSave = async (): Promise<any> => {
      try {
        const { data } = await BindService.cardBindApi({
          ...state.bindForm,
          memberNo: memberInfo.value.memberNo,
          orgId: localStorage.getItem("ORG_ID")
        })
        if (data.code === 200) {
          console.log(data.content)
          Toast("绑定成功")
          router.push({
            name: "User",
            query: {
              cardNo: state.bindForm.cardNo,
              serialNo: state.bindForm.serialNo
            }
          })
        }
      } catch ({ data }) {
        // 报错已绑定
        console.log(data.code, data.message)
        if (data.code === 83001) {
          Toast("当前卡已被绑定，请更换手机号")
          router.push({
            name: 'ChangePhone',
            query: {
              phone: data.message,
              cardNo: state.bindForm.cardNo,
              serialNo: state.bindForm.serialNo
            }
          })
        }
      }
    }
    const onFailed = (errorInfo: any) => {
      console.log('failed', errorInfo);
      Toast("卡信息有误，请检查")
    };
    return {
      ...toRefs(state),
      handleScanCode,
      handleClickSave,
      onFailed
    }
  }
})
</script>

<style lang="scss" scoped>
.bind-form {
  background-color: #ffffff;
}
</style>