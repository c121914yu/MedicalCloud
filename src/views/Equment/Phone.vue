<template>
  <div class="phone">
    <i class="iconfont icon-phone"></i>
    <p class="center remark"><small>该手机将被用于接受用药通知</small></p>
    <input
      type="tel"
      placeholder="手机号"
      disabled
      v-model="phone"
    >
    <div class="remind">
      <div class="note">
        <p>短信通知</p>
        <p><strong style="color:var(--red)">免费</strong></p>
      </div>
      <div class="voice">
        <p>语音通知</p>
        <p>剩余 <span style="color:var(--green)"><strong>5</strong></span> 次</p>
        <p class="recharge">充值</p>
      </div>
    </div>
  </div>
</template>

<script>
const reg = /^1[3456789]\d{9}$/
export default {
  data() {
    return {
      phone: '',
    }
  },
  created() {
    this.phone = this.$store.getters.getUser.phone
  },
}
</script>

<style lang="stylus" scoped>
.phone
  padding 0 5%
  padding-top 60px
  display flex
  flex-direction column
  align-items center
  i
    width 70px
    height 70px
    line-height 70px
    text-align center
    font-size 2.4em
    color var(--gray1)
    border var(--border1)
    border-radius 50%
  input
    margin 10px 0
    width 100%
  .remind
    margin-top 10px
    width 100%
    display grid
    grid-template-columns 1fr 1fr
    grid-gap 10px
    div
      padding 5px
      border var(--border1)
      border-radius 5px
      .recharge
        text-decoration underline
        color var(--green)
</style>