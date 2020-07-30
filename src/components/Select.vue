<template>
	<div class="select">
		<div class="text" :class="open ? 'active' : ''" @click="open = !open">
			<p>{{ value }}</p>
			<i class="iconfont icon-back"></i>
		</div>
		<div class="list" :style="open ? 'height:' + listHeight + 'px' : ''">
			<div
				class="item"
				v-for="(item, index) in list"
				:key="index"
				@click="checkItem(item)"
			>
				{{ item.text }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	model: {
		prop: "value", //指向props的参数名
		event: "change", //事件名称
	},
	props: {
		value: String,
		list: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			open: false,
			listHeight: 0,
		}
	},
	methods: {
		checkItem(item) {
			this.$emit("change", item.value)
			this.open = false
		},
	},
	created() {
		this.listHeight = this.list.length * 45
	},
}
</script>

<style lang="stylus" scoped>
.select
	.text
		padding 5px 10px
		border var(--border1)
		border-radius 5px
		display flex
		align-items center
		justify-content center
		i
			position absolute
			right 10px
			margin-left 10px
			font-size 0.8em
			color var(--gray1)
			transform rotate(-90deg)
			transition var(--speed2)
		&.active
			color var(--green)
			border-color var(--green)
			i
				transform rotate(90deg)
	.list
		z-index 5
		position absolute
		margin-top 2px
		left 0
		width 100%
		height 0
		background-color #fff
		border-radius 5px
		box-shadow var(--shadow2)
		overflow 	hidden
		transition var(--speed2)
		.item
			height 45px
			line-height 45px
			text-align center
			&:active
				background-color  var(--green3)
</style>
