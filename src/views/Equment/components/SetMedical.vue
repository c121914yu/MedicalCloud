<template>
  <div class="set-medical">
    <div
      class="mask"
      @click="$emit('close')"
    ></div>

    <div class="popup">
      <h2 class="center">药柜{{index}}</h2>
      <div class="btns">
        <button class="sure">确认</button>
        <button
          class="close"
          @click="$emit('close')"
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    medicines: Array,
    index: Number,
  },
  data() {
    return {
      temp_medicines: null,
    }
  },
  methods: {},
  created() {
    console.log(this.medicines)
    this.temp_medicines = [...this.medicines]
  },
}
</script>

<style lang="stylus" scoped>
.set-medical
  .popup
    .btns
      display flex
      align-items center
      justify-content space-around
      button
        width 40%
      .close
        background-color var(--gray1)
</style>