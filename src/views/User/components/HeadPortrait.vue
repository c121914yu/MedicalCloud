<template>
  <div class="head-portrait">
    <div class="users">
      <div class="picture">
        <img
          src="http://blogs.jinlongyuchitang.cn/avator.jpg"
          class="img"
          alt="加载失败"
        />
      </div>
      <p class="name"><strong>jlYU</strong></p>
      <router-link
        class="change"
        to="/User/SetUser"
      >切换用户</router-link>
      <div class="statistics">
        <div
          class="item"
          v-for="(item, index) in statistics"
          :key="index"
        >
          <p>{{item.text}}</p>
          <h2>{{item.amount}}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statistics: [
        { text: '提醒计划', amount: 3 },
        { text: '绑定设备', amount: 2 }
      ]
    }
  }
}
</script>

<style lang="stylus" scope>
.head-portrait
  *
    margin 0
    padding 0
  margin-bottom 100px
  width 100vw
  height 160px
  background-color var(--green)
  border-bottom-left-radius 30px
  border-bottom-right-radius 30px
  filter brightness(110%)
  .users
    margin 0 auto
    width 90%
    height 160px
    background-color #fff
    transform translateY(50%)
    border-radius 5px
    box-shadow 2px 2px 5px rgba(0, 0, 0, 0.2)
    display flex
    flex-direction column
    align-items center
    .picture
      z-index 2
      transform translateY(-50%)
      width 100px
      height 100px
      border-radius 50%
      padding 8px
      background-color #fff
      .img
        width 100%
        height 100%
        box-shadow var(--shadow1)
        border-radius 50%
    .name
      margin-top -40px
      letter-spacing 1px
    .change
      position absolute
      top 5px
      right 5px
      color var(--green)
      filter brightness(80%)
    .statistics
      flex 1
      width 100%
      display flex
      justify-content space-around
      align-items center
      text-align center
      .item
        width 50%
      .item:first-child::after
        position absolute
        top 0
        right 0
        content ''
        width 2px
        height 100%
        background-color var(--gray)
      h2
        color var(--green)
</style>