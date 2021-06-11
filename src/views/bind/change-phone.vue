<template>
  <Page isHeader>
    <div class="bind-form">
      <van-form
        label-width="2.2rem"
        @submit="handleClickChange"
        @failed="onFailed"
      >
        <van-field
          v-model="cardNo"
          :rules="[
            { required: true, message: '请输入实体卡卡号' }
          ]"
          name="卡号"
          type="number"
          label="卡号"
          placeholder="请输入实体卡卡号"
          autocomplete="off"
        >
          <template #right-icon>
            <i class="icon iconfont iconsaomiao lk-font-18" @click="handleScanCode" />
          </template>
        </van-field>
        <van-field
          v-model="serialNo"
          :rules="[
            { required: true, message: '请输入序列号' }
          ]"
          name="序列号"
          autocomplete="off"
          clearable
          label="序列号"
          placeholder="请输入序列号"
        />
        <van-field label="绑定手机号">
          <template v-slot:input>
            <phone :phone="phone || cardInfo.phone" />
          </template>
        </van-field>
        <van-field
          v-model="oldPhoneCode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          type="number"
          clearable
          label="验证码"
          maxlength="6"
          placeholder="请输入验证码"
          autocomplete="off"
        >
          <template #button>
            <MsgCode :phone="phone || cardInfo.phone" type="RECHARGE_CARD_CHANGE_PHONE_OLD" />
          </template>
        </van-field>
        <van-field
          v-model="newPhone"
          :rules="[
            { required: true, message: '请输入更换手机号' },
            { pattern: patternPhone, message: '手机号格式错误' }
          ]"
          name="更换手机号"
          type="number"
          clearable
          maxlength="11"
          label="更换手机号"
          placeholder="更换手机号"
          autocomplete="off"
        />
        <van-field
          v-model="newPhoneCode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          type="number"
          maxlength="6"
          clearable
          label="验证码"
          placeholder="请输入验证码"
          autocomplete="off"
        >
          <template #button>
            <MsgCode :phone="newPhone" type="RECHARGE_CARD_CHANGE_PHONE_NEW" />
          </template>
        </van-field>
        <div class="content lk-p-t-40 defalut-bg">
          <van-button
            class="font-1"
            color="#F8B500"
            block
            round
            native-type="submit"
          >更换</van-button>
        </div>
      </van-form>
    </div>
  </Page>
</template>

<script lang="ts">
import MsgCode from '@/components/Msgcode.vue'
import Phone from '@/components/Phone.vue'
import { BindService } from '@/api/bind'
import { Toast } from 'vant'
import { useRouter, useRoute, LocationQuery } from 'vue-router'
import { defineComponent, computed, reactive, toRefs, onBeforeMount } from 'vue'
import { getWxJsConfigAction } from '@/utils/wx-config'
import { useStore } from 'vuex'
export default defineComponent({
  name: "ChangePhone",
  components: {
    MsgCode,
    Phone
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = reactive<{ patternPhone: RegExp, phone: string }>({
      patternPhone: /^1[3456789]\d{9}$/,
      phone: ""
    })
    const changeForm = reactive({
      cardNo: "",
      serialNo: "",
      oldPhoneCode: "",
      newPhone: "",
      newPhoneCode: ""
    })
    onBeforeMount(() => {
      const query: LocationQuery = route.query
      state.phone = String(query.phone || "")
      changeForm.cardNo = String(query.cardNo || "")
      changeForm.serialNo = String(query.serialNo || "")
    })

    const memberInfo = computed(() => store.state.entery.memberInfo)
    const cardInfo = computed(() => store.state.card.cardInfo)

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
      window.wx.ready(() => {
        TOAST.clear()
        window.wx.scanQRCode({
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

    // 解析扫码内容
    const parseResult =(str: string): any => {
      // {host}/web/qrcode/recharge/card/1234567890123456/123123
      // {host}/web/qrcode/recharge/card/{cardNo}/{serialNo}
      if (!str) return false
      let resultSplit = str.split("/"),
        length = resultSplit.length
      changeForm.cardNo = resultSplit[length - 2]
      changeForm.serialNo = resultSplit[length - 1]
    }

    const handleClickChange = async (): Promise<any> => {
      try {
        const { data } = await BindService.updateCardPhoneApi({
          ...changeForm,
          memberNo: memberInfo.value.memberNo
        })
        if (data.code === 200) {
          console.log(data.content)
          Toast("更改成功")
          router.push({
            name: "User",
            query: {
              cardNo: changeForm.cardNo,
              serialNo: changeForm.serialNo
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    const onFailed = (errorInfo: any) => {
      console.log('failed', errorInfo);
      Toast("信息有误，请检查")
    }

    return {
      ...toRefs(state),
      ...toRefs(changeForm),
      cardInfo,
      handleScanCode,
      handleClickChange,
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