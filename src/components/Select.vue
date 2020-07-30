<template>
	<div class="select">
		<div class="text" @click="open = !open">
			<div>{{ placeholder }}</div>
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
	props: {
		placeholder: {
			type: String,
			default: "",
		},
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
		i
			margin-left 10px
			font-size 0.8em
			color var(--gray1)
			transform rotate(-90deg)
	.list
		z-index 5
		position absolute
		left 0
		width 100%
		height 0
		border-radius 5px
		box-shadow var(--shadow2)
		overflow 	hidden
		transition var(--speed2)
		.item
			height 45px
			line-height 45px
			text-align center
		&:active
			background-color var(--green)
</style>
