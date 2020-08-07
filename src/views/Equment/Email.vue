<template>
  <div class="email">
    <i class="iconfont icon-email"></i>
    <form @submit="changeTel">
      <input
        type="tel"
        placeholder="邮箱地址"
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
      >确认</button>
    </form>
  </div>
</template>

<script>
const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
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
          text: '邮箱格式错误',
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
          text: '邮箱格式错误',
        })
      else {
        this.$showToast({
          text: '邮箱绑定成功',
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
.email
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
    color var(--yellow)
    border var(--border1)
    border-color var(--yellow)
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
</style>