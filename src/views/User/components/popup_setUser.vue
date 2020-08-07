<template>
  <div class="popup-setUser">
    <div class="mask"></div>
    <div class="popup">
      <img :src="image">
      <input
        type="text"
        placeholder="昵称"
        v-model="name"
      >
      <div class="btns">
        <button
          class="confirm"
          @click="confirm"
        >确认</button>
        <button
          class="cancel"
          @click="$emit('close')"
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    param_image: {
      type: String,
      default: 'http://blogs.jinlongyuchitang.cn/avator.jpg',
    },
    param_name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '',
      image: '',
    }
  },
  methods: {
    confirm() {
      if (this.name === '')
        this.$showToast({
          type: 'warn',
          text: '名称不能为空',
        })
      else
        this.$emit('confirm', {
          name: this.name,
          image: this.image,
        })
    },
  },
  created() {
    this.name = this.param_name
    this.image = this.param_image
  },
}
</script>

<style lang="stylus" scope>
.popup-setUser
  .popup
    display flex
    flex-direction column
    align-items center
    img
      width 70px
      height 70px
      border-radius 50%
      box-shadow var(--shadow2)
    input
      margin 10px 0
      width 90%
    .btns
      width 100%
      display flex
      justify-content space-around
      button
        width 30%
      .cancel
        background-color var(--gray)
</style>