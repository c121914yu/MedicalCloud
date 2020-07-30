<template>
	<div class="medical-box">
		<i class="iconfont icon-icon"></i>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {},
}
</script>

<style lang="stylus" scoped>
.medical-box
  padding 0 5px
  padding-top 60px
  display flex
  flex-direction column
  align-items center
  i
    width 70px
    height 70px
    line-height 70px
    text-align center
    font-size 2.4em
    color var(--green)
    border var(--border1)
    border-color var(--green)
    border-radius 50%
</style>
