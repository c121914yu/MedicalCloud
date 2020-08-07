<template>
  <div class="page-login">
    <i class="iconfont icon-icon icon"></i>
    <h1>欢迎使用医云助手</h1>
    <keep-alive>
      <router-view class="login"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus">
.page-login
  z-index 15
  width 100vw
  height 100vh
  background-color #ffffff
  padding 15% 5%
  .icon
    font-size 4em
    color var(--green)
    line-height 1
  h1
    line-height 1
    margin-bottom 30px
.login
  form
    .input
      margin 10px 0
      padding 5px
      border-bottom var(--border1)
      display flex
      align-items center
      input
        margin-left 5px
        flex 1
        border 0
        font-size 1.2em
      i
        font-size 1.8em
        color var(--green)
    button
      margin 30px 0 20px
      width 100%
      padding 12px
      border-radius 20px
      filter brightness(110%)
  .change-nav
    float right
</style>
