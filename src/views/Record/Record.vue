<template>
  <div class="record">
    <Calendar
      ref="Calendar"
      :warnDate="warnDate"
      @changeDay="changeDay"
      @clearHigh="highLightIndex=-1"
    ></Calendar>
    <header>
      <i class="iconfont icon-record"></i>
      <h2>本月统计</h2>
    </header>
    <Summary
      :status="status"
      :highLightIndex="highLightIndex"
      @click="checkType"
    ></Summary>
    <CardList
      :list="currentList"
      date
    ></CardList>
  </div>
</template>

<script>
import Calendar from './components/calendar'
import Summary from '../../components/summary'
import CardList from '../../components/CardList'

export default {
  data() {
    return {
      currrentDate: {},
      records: [
        {
          status: 1,
          time: { year: 2020, month: 7, day: 21, time: '8:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 },
          ],
        },
        {
          status: 2,
          time: { year: 2020, month: 7, day: 20, time: '12:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 },
          ],
        },
        {
          status: 3,
          time: { year: 2020, month: 7, day: 19, time: '12:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 },
          ],
        },
        {
          status: 1,
          time: { year: 2020, month: 7, day: 19, time: '8:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 },
          ],
        },
      ],
      highLightIndex: -1,
    }
  },
  methods: {
    changeDay(date) {
      this.currrentDate = date
    },
    checkType(e) {
      let highLightIndex = -1
      switch (e.text) {
        case '已完成':
          highLightIndex = 0
          break
        case '超时完成':
          highLightIndex = 1
          break
        case '遗漏':
          highLightIndex = 2
          break
      }
      if (this.highLightIndex === highLightIndex) {
        this.highLightIndex = -1
      } else {
        this.highLightIndex = highLightIndex
        this.$refs.Calendar.currentIndex = -1
      }
    },
  },
  computed: {
    currentList() {
      if (this.highLightIndex === -1) {
        let newList = this.records.filter((item) => {
          return (
            item.time.year == this.currrentDate.year &&
            item.time.month == this.currrentDate.month &&
            (this.currrentDate.day === '' ||
              item.time.day === this.currrentDate.day)
          )
        })
        return newList
      } else {
        return this.records.filter((item) => {
          return item.status === this.highLightIndex + 1
        })
      }
    },
    warnDate() {
      let obj = {
        overtime: [],
        unfinish: [],
      }
      this.records.forEach((item) => {
        if (item.status === 2) obj.overtime.push(item.time.day)
        else if (item.status === 3) obj.unfinish.push(item.time.day)
      })
      return obj
    },
    status() {
      let arr = [
        { color: 'var(--green)', text: '已完成', amount: 0 },
        { color: 'var(--yellow)', text: '超时完成', amount: 0 },
        { color: 'var(--red)', text: '遗漏', amount: 0 },
      ]
      this.records.forEach((item) => {
        arr[item.status - 1].amount++
      })
      return arr
    },
  },
  components: {
    Calendar,
    Summary,
    CardList,
  },
}
</script>

<style lang="stylus" scoped>
.record
  padding 10px 10px 70px
  header
    margin 10px 0
    display flex
    align-items center
    color var(--green)
    i
      font-size 1.2em
    h2
      flex 1
      margin 0 5px
</style>