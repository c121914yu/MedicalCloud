<template>
  <div class="card-list">
    <div
      class="card"
      v-for="(item, index) in list"
      :key="index"
    >
      <div
        class="dot"
        :class="'dot'+item.status"
      ></div>
      <h2 class="time">
        <span v-if="date">{{item.time.month}}-{{item.time.day}} </span>
        {{item.time.time}}
      </h2>
      <div class="medicines">
        <div
          class="medical"
          v-for="(medical, index1) in item.medicines"
          :key="index1"
        >
          <p>{{medical.name}}
            <strong>*{{medical.amount}}</strong>
          </p>
        </div>
      </div>
      <p class="remark">备注:{{item.remark}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    date: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-list
  .card
    margin-bottom 15px
    padding 10px
    border-radius 5px
    box-shadow var(--shadow3)
    display flex
    align-items center
    flex-wrap wrap
    .dot
      width 10px
      height 10px
      border-radius 50%
      &.dot0
        background-color var(--gray1)
      &.dot1
        background-color var(--green)
      &.dot2
        background-color var(--yellow)
      &.dot3
        background-color var(--red)
    .time
      margin 0 10px
    .medicines
      strong
        letter-spacing 3px
        color var(--gray1)
    .remark
      margin-top 5px
      font-size 0.9em
      width 100%
</style>