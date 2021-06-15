<template>
  <span class="code-btn" @click="sendMsgCode">{{ codeTime }}</span>
</template>

<script lang="ts">
import { AppService } from '@/api/app'
import { Toast } from 'vant'
import { defineComponent, reactive, toRefs } from "vue";
import { GetMsgCodeParams } from '@/api/types/App'
export default defineComponent({
  props: {
    type: {
      type: String,
      default: ""
    },
    phone: {
      type: [String, Number],
      default: ""
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    const state = reactive<{ codeTime: string, timer: number | undefined }>({
      codeTime: "发送验证码",
      timer: undefined
    })
    const timerRunning = (): void => {
      if (state.timer) return
      let time = 60
      state.timer = setInterval(() => {
        time--
        state.codeTime = `${time} s`
        if (time <= 0) {
          clearInterval(state.timer)
          state.timer = undefined
          state.codeTime = "发送验证码"
        }
      }, 1000)
    }
    const sendMsgCode = async (): Promise<void> => {
      if (state.timer) return
      if (!/^1[3456789]\d{9}$/.test(props.phone.toString())) {
        Toast("请使用正确的手机号")
        return
      }
      let body: GetMsgCodeParams = {
        phone: props.phone,
        templateType: props.type,
        params: props.params,
        nonceStr: Math.random().toString(),
        signName: "大黄鹅"
      }
      try {
        const { data } = await AppService.getVCodeWhiteApi({
          ...body
        })
        if (data.code === 200) {
          timerRunning()
        }
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      sendMsgCode
    }
  },
})
</script>

<style lang="scss" scoped>
.code-btn {
  color: #F8B500;
  font-size: 16px;
  display: inline-block;
  max-width: 100px;
  min-width: 30px;
}
</style>