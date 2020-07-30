<template>
  <div
    class="toast"
    @click="remove"
  >
    <div class="mask"></div>
    <div class="popup">
      <i :class="'iconfont icon-'+type"></i>
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      duration: 1500,
      type: '',
      time: null
    }
  },
  methods: {
    remove() {
      if (this.time) clearInterval(this.time)
      const dom = document.querySelector('.toast')
      if (dom) document.body.removeChild(dom)
    }
  },
  mounted() {
    setTimeout(() => {
      this.time = setInterval(() => {
        clearInterval(this.time)
        document.querySelector('.toast').classList.add('hide')
        setTimeout(() => {
          const dom = document.querySelector('.toast')
          if (dom) document.body.removeChild(dom)
        }, 600)
      }, this.duration + 600)
    })
  }
}
</script>

<style lang="stylus" scope>
.toast
  z-index 30
  user-select none
  animation show 0.9s forwards
  &.hide
    animation hide 0.5s forwards
  .mask
    background-color transparent
  .popup
    width 150px
    height 150px
    background-color rgba(0, 0, 0, 0.5)
    border-radius 10px
    color #ffffff
    text-align center
    i
      display block
      height 90px
      line-height 90px
      font-size 5em
    p
      height 40px
      line-height 40px
      font-size 1.2em
      letter-spacing 1px
@keyframes show
  from
    opacity 0
  to
    opacity 1
@keyframes hide
  from
    opacity 1
  to
    opacity 0
</style>