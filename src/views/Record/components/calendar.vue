<template>
  <div class="calendar">
    <header>
      <div class="date">
        <i
          class="iconfont icon-back"
          @click="changeDate(-1)"
        ></i>
        <p>{{ currentDay.year }}-{{ currentDay.month }}<span v-if="currentDay.day">-{{ currentDay.day }}</span></p>
        <i
          class="iconfont icon-next"
          @click="changeDate(1)"
        ></i>
      </div>
      <small
        class="today"
        @click="backToday"
      >返回本月</small>
    </header>
    <div class="content">
      <div class="title">
        <div
          class="item"
          v-for="(item, index) in titleText"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="day">
        <div
          class="item"
          :style="item.gray ? 'color:var(--gray)' : ''"
          :class="{
            overtime: item.overtime,
            unfinish: item.unfinish,
						currentDay: index === currentIndex
					}"
          v-for="(item, index) in dayList"
          :key="index"
          @click="checkDay(index)"
        >
          {{ item.val }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    warnDate: Object,
  },
  data() {
    return {
      titleText: ['日', '一', '二', '三', '四', '五', '六'],
      currentDay: {},
      dayList: [],
      currentIndex: -1,
    }
  },
  methods: {
    formatterDate(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
    },
    changeDate(i) {
      let Str_currentDay = `${this.currentDay.year}-${this.currentDay.month}-${this.currentDay.day}`
      let temp = this.dayList.filter((item) => !item.gray)
      this.currentDay = this.formatterDate(
        new Date(
          new Date(Str_currentDay).getTime() +
            i * 24 * 60 * 60 * 1000 * temp.length
        )
      )
      this.updateAmount()
    },
    getMonth_dayAmount(year, month) {
      let nextMonth = month + 1
      let nextYear = year
      if (nextMonth === 13) {
        nextYear++
        nextMonth = 1
      }
      let diff =
        new Date(`${nextYear}-${nextMonth}-1`) - new Date(`${year}-${month}-1`)
      let amount = diff / 24 / 60 / 60 / 1000
      return amount
    },
    updateAmount() {
      this.dayList = []
      let Str_currentDay = `${this.currentDay.year}-${this.currentDay.month}-${this.currentDay.day}`
      // 计算第一天星期几
      let firstDay = new Date(new Date(Str_currentDay).setDate(1)) //设当前月份第一天
      let forwardAmount = firstDay.getDay()
      // 添加上一个月末尾天数
      for (let i = forwardAmount; i >= 1; i--) {
        let lastMonthDay = new Date(
          firstDay.getTime() - i * 24 * 60 * 60 * 1000
        ).getDate()
        this.dayList.push({
          val: lastMonthDay,
          gray: true,
        })
        this.change_currentDay()
      }
      // 计算当前月份天数
      let len = this.getMonth_dayAmount(
        new Date(Str_currentDay).getFullYear(),
        new Date(Str_currentDay).getMonth() + 1
      )
      for (let i = 1; i <= len; i++) {
        let obj = {
          val: i,
          gray: false,
          overtime: false,
          unfinish: false,
        }
        if (this.warnDate.overtime.indexOf(i) > -1) obj.overtime = true
        else if (this.warnDate.unfinish.indexOf(i) > -1) obj.unfinish = true
        this.dayList.push(obj)
      }
      // 计算下个月前n天
      let n = Math.ceil(this.dayList.length / 7) * 7 - this.dayList.length
      for (let i = 1; i <= n; i++) {
        this.dayList.push({
          val: i,
          gray: true,
        })
      }
      // 计算选中的下标
      this.currentDay.day = ''
      this.currentIndex = -1
    },
    backToday() {
      this.currentDay = this.formatterDate(new Date())
      this.updateAmount()
    },
    checkDay(index) {
      if (!this.dayList[index].gray) {
        if (this.currentIndex === index) {
          this.currentIndex = -1
          this.currentDay.day = ''
        } else {
          let forwardIndex
          for (let i = 0; i <= index; i++)
            if (!this.dayList[i].gray) {
              forwardIndex = i
              break
            }
          let day = index - forwardIndex + 1
          this.currentDay.day = day
          this.currentIndex = index
        }
        this.change_currentDay()
      }
    },
    change_currentDay() {
      this.$emit('changeDay', this.currentDay)
      this.$emit('clearHigh')
    },
  },
  created() {
    this.backToday()
    // console.log(new Date("2020-7-19").getDay())
  },
}
</script>

<style lang="stylus" scoped>
.calendar
  padding 5px
  background-color #ffffff
  border-radius 10px
  box-shadow var(--shadow2)
  header
    .date
      display flex
      justify-content center
      p
        text-align center
        width 100px
      i
        color var(--gray)
    .today
      position absolute
      top 0
      right 0
      color var(--green)
  .content
    margin-top 10px
    .title, .day
      width 100%
      display grid
      grid-template-columns repeat(7, 1fr)
      grid-row-gap 10px
      text-align center
    .item
      height 30px
      width 30px
      line-height 30px
      margin 0 auto
      border 1px solid transparent
      border-radius 50%
      &.overtime
        color var(--yellow)
        border-color var(--yellow)
      &.unfinish
        color var(--red)
        border-color var(--red)
      &.currentDay
        border-color var(--green)
        background-color rgba(60, 215, 147, 0.5)
    .title
      margin-bottom 10px
      background-color rgba(60, 215, 147, 0.15)
      border-radius 5px
      .item
        font-weight 600
        filter brightness(110%)
        color var(--green)
</style>
