<template>
  <div class="remind">
    <header>
      <i class="iconfont icon-remind"></i>
      <h2>当日提醒总览</h2>
      <router-link
        class="btn"
        :to="{name:'EditRemind'}"
      >
        添加提醒
      </router-link>
    </header>
    <Summary :status="status"></Summary>
    <CardList :list="remindList"></CardList>
  </div>
</template>

<script>
import Summary from '../../components/summary'
import CardList from '../../components/CardList'
export default {
  data() {
    return {
      status: [
        { color: 'var(--gray1)', text: '未开始', amount: 1 },
        { color: 'var(--green)', text: '已完成', amount: 1 },
        { color: 'var(--yellow)', text: '超时完成', amount: 1 },
        { color: 'var(--red)', text: '遗漏', amount: 1 }
      ],
      remindList: [
        {
          status: 1,
          time: { year: 2020, month: 7, day: 26, time: '3:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 }
          ]
        },
        {
          status: 3,
          time: { year: 2020, month: 7, day: 26, time: '8:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 }
          ]
        },
        {
          status: 2,
          time: { year: 2020, month: 7, day: 26, time: '12:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 }
          ]
        },
        {
          status: 0,
          time: { year: 2020, month: 7, day: 26, time: '17:00' },
          remark: '饭后热水服用',
          medicines: [
            { name: '阿莫西林', amount: 2 },
            { name: '小柴胡颗粒', amount: 1 },
            { name: 'sfa胶囊', amount: 1 }
          ]
        }
      ]
    }
  },
  methods: {
    changeDay(date) {
      // 根据date获取提醒内容
      console.log(date)
    }
  },
  components: {
    Summary,
    CardList
  }
}
</script>

<style lang="stylus" scoped>
.remind
  padding 0 10px 70px
  header
    margin 10px 0
    display flex
    align-items center
    color var(--green)
    h2
      flex 1
      margin 0 5px
    .btn
      font-size 0.8em
  .summary
    margin-bottom 15px
    display grid
    grid-template-columns repeat(4, 1fr)
    grid-column-gap 5px
    text-align center
    .item
      padding 8px 0
      border var(--border1)
      border-radius 5px
</style>