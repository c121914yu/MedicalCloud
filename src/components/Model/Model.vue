<template>
  <div class="model">
    <div class="mask"></div>
    <div class="popup">
      <h2 class="center">{{head}}</h2>
      <p>&emsp;{{text}}</p>
      <div class="btns">
        <button
          class="confirm"
          :style="'backgroundColor:'+confirmColor"
          @click="confirm"
        >{{confirmText}}</button>
        <button
          class="cancel"
          @click="cancel"
        >{{cancelText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      head: '',
      text: '',
      confirmText: '',
      cancelText: '',
      confirmColor: ''
    }
  },
  methods: {
    confirm() {
      if (this.success) this.success()
      this.cancel()
    },
    cancel() {
      const dom = document.querySelector('.model')
      document.body.removeChild(dom)
    }
  }
}
</script>

<style lang="stylus" scope>
.model
  user-select none
  position absolute
  .popup
    padding 10px 10px 0
  p
    margin 10px 0
  .btns
    padding 10px 0
    display flex
    justify-content space-around
    button
      width 30%
      &.cancel
        background-color var(--gray)
</style>