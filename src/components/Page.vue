<template>
  <div
    class="page-content"
    :style="{ backgroundColor: bg ? bg : '#F5F7FA' }"
  >
    <div v-if="isHeader">
      <van-nav-bar
        :title="title || routeTitle"
        :left-arrow="isBack"
        @click-left="onClickLeft"
      >
        <template #right>
          <slot name="tools" />
        </template>
      </van-nav-bar>
    </div>
    <div class="page-wrap">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ComputedRef } from 'vue';
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "Page",
  props: {
    bg: {
      type: String,
      default: "#F5F7FA"
    },
    title: {
      type: String,
      default: ""
    },
    isHeader: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const routeTitle: ComputedRef = computed((): unknown => {
      return route.meta.title;
    })
    const onClickLeft = (): void => {
      router.back()
      console.log("back")
    }
    return {
      routeTitle,
      onClickLeft
    }
  }
})
</script>

<style lang="scss" scoped>
  .page-content {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .page-wrap {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: inherit;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>