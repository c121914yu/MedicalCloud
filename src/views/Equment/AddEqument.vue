<template>
	<div class="addEqu">
		<Select placeholder="设备类型" :list="types"></Select>
	</div>
</template>

<script>
import Select from "../../components/Select"
export default {
	data() {
		return {
			types: [{ text: "智能药盒" }, { text: "智能手环" }],
		}
	},
	methods: {},
	components: {
		Select,
	},
}
</script>

<style lang="stylus" scoped>
.addEqu
  padding-top 60px
  display flex
  flex-direction column
  align-items center
</style>
