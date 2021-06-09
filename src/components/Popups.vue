<template>
  <van-popup
    class="popup-box"
    v-model:show="isShow"
    round
    :close-on-click-overlay="false"
  >
    <div v-if="title" class="pop-header">
      <p class="lk-font-18 font-1 lk-m-b-16">{{ title }}</p>
    </div>
    <div class="pop-content">
      <slot name="content" />
    </div>
    <div class="pop-footer">
      <slot name="footer" />
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const isShow = computed(() => {
      return props.visible
    })
    return {
      isShow
    }
  }
})
</script>

<style lang="scss" scoped>
  .popup-box {
    width: 70%;
    padding: 24px;
    .pop-header {
      text-align: center;
    }
    .pop-content {
      width: 100%;
      max-height: 55vh;
      overflow-y: scroll;
    }
  }
</style>
<style>
  .popup-box {
    width: 70%;
    padding: 24px;
  }
</style>