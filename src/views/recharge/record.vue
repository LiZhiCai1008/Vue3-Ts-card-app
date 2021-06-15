<template>
  <Page isHeader>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      v-model:error="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="getRecordList"
    >
      <van-cell
        center
        v-for="(item, idx) in recordList"
        :key="idx"
        :title="item.tradeTypeStr"
        :label="item.gmtCreated"
      >
        <span class="font-1 lk-font-xl">{{ item.payFlowType }}{{ amountFmt(item.tradeAmount) }}</span>
      </van-cell>
    </van-list>
  </Page>
</template>

<script lang="ts">
import { AppService } from '@/api/app'
import { useStore } from 'vuex'
import { FormatType } from '@/types/Card.d'
import { amountFmt } from '@/utils/filter'
import { defineComponent, computed, reactive, toRefs } from 'vue'
export default defineComponent({
  name: "Record",
  components: {},
  setup() {
    const store = useStore()
    const state = reactive<{
      recordList: any,
      page: number,
      total: number,
      loading: boolean,
      finished: boolean,
      error: boolean,
      amountFmt: FormatType
    }>({
      recordList: [],
      page: 1,
      total: 0,
      loading: false,
      finished: false,
      error: false,
      amountFmt
    })
    const cardInfo = computed(() => store.state.card.cardInfo)

    const getRecordList = async (): Promise<void> => {
      try {
        const { data } = await AppService.getTradeRecordApi({
          cardNo: cardInfo.value.cardNo,
          serialNo: cardInfo.value.serialNo,
          page: state.page,
          pageSize: 10
        })
        if (data.code === 200) {
          console.log(data.content)
          state.recordList = state.recordList.concat(data.content.currentList)
          state.total = data.content.totalSize
          state.loading = false;
          state.page ++
          if (state.recordList.length >= state.total) {
            state.finished = true;
          }
        }
      } catch (error) {
        console.log(error)
        state.loading = false
        state.error = true
      }
    }
    return {
      ...toRefs(state),
      cardInfo,
      getRecordList
    }
  }
})
</script>

<style lang="scss" scoped>

</style>