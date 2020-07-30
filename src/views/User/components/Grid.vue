<template>
	<div class="grid">
		<router-link
			class="item"
			v-for="(item, index) in grids"
			:key="index"
			:to="{ name: item.name }"
		>
			<i :class="'iconfont icon-' + item.icon"></i>
			<p>{{ item.text }}</p>
		</router-link>
	</div>
</template>

<script>
export default {
	data() {
		return {
			grids: [
				{ text: "电子病历", icon: "bingli", name: "Case" },
				{ text: "体检报告", icon: "baogao", name: "Report" },
				{ text: "电子说明书", icon: "instructions", name: "Introduction" },
				{ text: "使用帮助", icon: "bangzhu", name: "UsingHelp" },
			],
		}
	},
}
</script>

<style lang="stylus" scope>
lineY(w)
  position absolute
  content ''
  width w
  height 100%
  background-color #d4d4d4
lineX(h)
  position absolute
  content ''
  width 100%
  height h
  background-color #d4d4d4
.grid
  margin 0 auto
  width 90%
  padding 10px
  border-radius 5px
  background-color #ffffff
  box-shadow var(--shadow3)
  display grid
  grid-template-columns 1fr 1fr
  .item
    width 100%
    height 120px
    display flex
    flex-direction column
    align-items center
    justify-content center
    &:active
      background var(--green1)
    i
      font-size 2em
      font-weight 600
      color var(--green)
    &:nth-child(1):after
      lineY(1px)
      right 0
    &:nth-child(1):before
      lineX(1px)
      bottom 0
    &:nth-child(2):before
      lineX(1px)
      bottom 0
    &:nth-child(3):after
      lineY(1px)
      right 0
</style>
