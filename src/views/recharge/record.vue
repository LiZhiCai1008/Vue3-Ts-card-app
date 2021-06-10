<template>
  <Page isHeader>
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
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
        <span class="font-1 lk-font-xl">{{ item.payFlowType }}{{ item.tradeAmount | amountFmt }}</span>
      </van-cell>
    </van-list>
  </Page>
</template>

<script>
import { getTradeRecordApi } from '@/api/app'
import { mapState } from 'vuex'
export default {
  name: "Record",
  components: {},
  data() {
    return {
      recordList: [],
      page: 1,
      total: 0,
      loading: false,
      finished: false,
      error: false
    }
  },
  computed: {
    ...mapState('card', ['cardInfo'])
  },
  methods: {
    async getRecordList() {
      try {
        const { code, content } = await getTradeRecordApi({
          cardNo: this.cardInfo.cardNo,
          serialNo: this.cardInfo.serialNo,
          page: this.page,
          pageSize: 10
        })
        if (code === 200) {
          console.log(content)
          this.recordList = this.recordList.concat(content.currentList)
          this.total = content.totalSize
          this.loading = false;
          this.page ++
          if (this.recordList.length >= this.total) {
            this.finished = true;
          }
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>