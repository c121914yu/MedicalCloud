<template>
  <div id="app">
    <Nav></Nav>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  components: {
    Nav,
  },
}
</script>

<style lang="stylus">
@import './assets/common.styl'
</style>
