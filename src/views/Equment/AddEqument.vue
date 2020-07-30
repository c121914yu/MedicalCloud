<template>
	<div class="addEqu">
		<Select class="type" :list="types" v-model="type"></Select>
		<form @submit="save">
			<div class="input">
				<input type="text" placeholder="设备标识码" v-model="id" required />
				<i class="iconfont icon-icon"></i>
				<i class="iconfont icon-scan scan" @click="scan"></i>
			</div>
			<div class="input">
				<input
					type="text"
					placeholder="给设备起个昵称"
					v-model="name"
					required
				/>
				<i class="iconfont icon-name"></i>
			</div>
			<button type="submit">确认</button>
		</form>
	</div>
</template>

<script>
import Select from "../../components/Select"
export default {
	data() {
		return {
			types: [
				{ text: "智能药盒", value: "智能药盒" },
				{ text: "智能手环", value: "智能手环" },
			],
			type: "智能药盒",
			id: "",
			name: "",
		}
	},
	methods: {
		scan() {
			console.log("扫一扫")
		},
		save(e) {
			e.preventDefault()
			console.log(this.type)
			this.$showToast({
				text: "添加成功",
			})
			this.$router.push({ name: "Equment" })
		},
	},
	components: {
		Select,
	},
}
</script>

<style lang="stylus" scoped>
.addEqu
  position relative
  padding 60px 5% 0
  display flex
  flex-direction column
  align-items center
  .type
    width 100%
  form
    width 100%
    .input
      margin-top 15px
      width 100%
      display flex
      align-items center
      border none
      i
        z-index 2
        position absolute
        font-size 1.6em
        color var(--gray1)
        &.scan
          right 10px
      input
        margin 0
        width 100%
        padding-left 35px
        font-size 1em
        border-radius 0
        border-bottom var(--border1)
        &:focus
          border-color var(--green)
        &:focus + i
          color var(--green)
          font-weight 500
    button
      margin 5px 0
</style>
