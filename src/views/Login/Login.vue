<template>
  <div class="login">
    <form @submit="Login">
      <div class="input">
        <i class="iconfont icon-phone"></i>
        <input
          type="number"
          placeholder="请输入手机号"
          required
          autocomplete="off"
          v-model="phone"
        />
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
        />
      </div>
      <button type="submit">登录</button>
    </form>
    <router-link
      class="change-nav"
      to="/SetNumber"
      style="color:var(--green)"
    >注册 & 修改密码</router-link>
  </div>
</template>

<script>
import { login } from '../../assets/axios/api'
export default {
  data() {
    return {
      phone: '',
      password: '',
    }
  },
  methods: {
    Login(e) {
      e.preventDefault()
      const reg = /^1[3456789]\d{9}$/
      if (!reg.test(this.phone))
        this.$showToast({
          type: 'warn',
          text: '手机格式错误',
        })
      else {
        login({
          phone: this.phone,
          password: this.password,
        }).then((res) => {
          localStorage.setItem('TOKEN', res.data.token)
          this.$store.commit('setUser', res.data.data)
          this.$router.push({ name: 'User' })
          this.$showToast({
            text: '登录成功',
          })
        })
      }
    },
  },
}
</script>

<style lang="stylus"></style>
