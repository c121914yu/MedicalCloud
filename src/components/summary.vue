<template>
  <div class="summary">
    <div
      class="item"
      :style="{
        color :index === highLightIndex ? '#fff':item.color,
        borderColor :item.color,
        backgroundColor: index===highLightIndex?item.color:''
      }"
      v-for="(item, index) in status"
      :key="index"
      @click="onclick(item)"
    >
      <p class="title">{{item.text}}</p>
      <h1 class="amount">{{item.amount}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: Array,
    highLightIndex: {
      type: Number,
      defult: -1
    }
  },
  methods: {
    onclick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="stylus" scoped>
.summary
  margin-bottom 15px
  display grid
  grid-template-columns repeat(3, 1fr)
  grid-column-gap 5px
  text-align center
  .item
    padding 8px 0
    border var(--border1)
    border-radius 5px
</style>