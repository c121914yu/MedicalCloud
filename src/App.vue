<template>
  <div id="app">
    <Nav></Nav>
    <router-view />
  </div>
</template>

<script>
import Nav from './components/Nav'
import { getActivity } from './assets/axios/api'
export default {
  components: {
    Nav
  },
  mounted() {
    const id = localStorage.getItem('userID')
    let name = this.$route.name
    if (id) {
      // 验证id
      if (name != 'Equment') this.$router.push({ name: 'Equment' })
      this.$showToast({
        text: '自动登录成功'
      })
    } else {
      if (name != 'Login' && name != 'Register' && name != 'FindPsw') {
        this.$router.push({ name: 'Login' })
        this.$showToast({
          type: 'warn',
          text: '请先登录'
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import './assets/common.styl'
</style>
