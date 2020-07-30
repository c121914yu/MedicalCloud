<template>
  <div class="phone">
    <i class="iconfont icon-phone"></i>
    <form @submit="changeTel">
      <input
        type="tel"
        placeholder="手机号"
        required
        v-model="phone"
      >
      <div class="random">
        <input
          type="tel"
          maxlength="6"
          placeholder="验证码"
          v-model="randomCode"
          required
        >
        <button
          :class="{
            'ban': time>0
          }"
          @click="sendCode"
        >{{codeText}}</button>
      </div>
      <button
        class="submit"
        type="submit"
      >修改手机号</button>
    </form>
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
      randomCode: '',
      time: 0,
      timer: null,
    }
  },
  methods: {
    sendCode(e) {
      e.preventDefault()
      if (!reg.test(this.phone))
        this.$showToast({
          type: 'warn',
          text: '手机格式错误',
        })
      else if (this.time <= 0) {
        this.time = 10
        this.timer = setInterval(() => {
          this.time--
          if (this.time <= 0) clearInterval(this.timer)
        }, 1000)
      }
    },
    changeTel(e) {
      e.preventDefault()
      if (!reg.test(this.phone))
        this.$showToast({
          type: 'warn',
          text: '手机格式错误',
        })
      else {
        this.$showToast({
          text: '手机修改成功',
        })
      }
    },
  },
  computed: {
    codeText() {
      if (this.time <= 0) return '获取验证码'
      else if (this.time < 10) return `0${this.time}s后获取`
      else return `${this.time}s后获取`
    },
  },
}
</script>

<style lang="stylus" scoped>
.phone
  padding 0 5px
  padding-top 60px
  display flex
  flex-direction column
  align-items center
  form
    width 90%
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
  .random
    display flex
    align-items center
    button
      margin 0 0 0 5px
      padding 5px 10px
      height 36px
      width 150px
      border-radius 5px
      &.ban
        background-color var(--gray)
        &:active
          transform scale(1)
  .submit
    margin 5px 0
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