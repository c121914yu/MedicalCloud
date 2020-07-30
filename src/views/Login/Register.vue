<template>
  <div class="register">
    <form @submit="register">
      <div class="input">
        <i class="iconfont icon-phone"></i>
        <input
          type="tel"
          placeholder="请输入手机号"
          required
          autocomplete="off"
          maxlength="11"
          v-model="phone"
        >
      </div>
      <div class="input">
        <i class="iconfont icon-password"></i>
        <input
          type="password"
          placeholder="请输入密码"
          minlength="6"
          required
          autocomplete="off"
          v-model="password"
        >
      </div>
      <div class="input">
        <i class="iconfont icon-password"></i>
        <input
          type="password"
          placeholder="请再次输入密码"
          minlength="6"
          required
          autocomplete="off"
          v-model="password2"
        >
      </div>
      <div class="input">
        <i class="iconfont icon-verification-code"></i>
        <input
          type="tel"
          placeholder="请输入验证码"
          required
          maxlength="6"
          autocomplete="off"
          v-model="code"
        >
        <button
          type="button"
          class="getCode"
          :class="{
            'ban': time>0
          }"
          @click="sendCode"
        >{{codeText}}</button>
      </div>
      <button type="submit">立即注册</button>
    </form>
    <div class="info">
      <router-link to="/FindPsw">忘记密码?</router-link>
      <router-link
        to="/"
        style="color:var(--green)"
      >已有账号</router-link>
    </div>
  </div>
</template>

<script>
const reg = /^1[3456789]\d{9}$/
export default {
  data() {
    return {
      phone: '',
      password: '',
      password2: '',
      code: '',
      timer: null,
      time: 0,
    }
  },
  methods: {
    sendCode() {
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
    register(e) {
      e.preventDefault()
      if (!reg.test(this.phone))
        this.$showToast({
          type: 'warn',
          text: '手机格式错误',
        })
      else if (this.password.length < 6)
        this.$showToast({
          type: 'warn',
          text: '密码小于6位',
        })
      else if (this.password != this.password2)
        this.$showToast({
          type: 'warn',
          text: '两次密码不同',
        })
      else if (this.code.length != 6)
        this.$showToast({
          type: 'warn',
          text: '验证码错误',
        })
      else {
        this.$showToast({
          text: '注册成功',
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
.getCode
  position absolute
  margin 0
  right 0
  width 100px
  &.ban
    background-color var(--gray)
    &:active
      transform scale(1)
</style>