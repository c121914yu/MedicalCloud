<template>
	<div class="addEqu">
		<Select class="type" :list="types" v-model="type"></Select>
		<form @submit="save">
			<div class="input">
				<input
					type="text"
					placeholder="设备标识码"
					v-model="identify"
					required
				/>
				<i class="iconfont icon-icon"></i>
				<label class="scan">
					<input type="file" />
					<i class="iconfont icon-scan" @click="scan"></i>
				</label>
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
			<textarea
				class="description"
				rows="3"
				placeholder="对设备进行简单的备注描述"
				v-model="description"
			></textarea>
			<button type="submit">确认</button>
		</form>
	</div>
</template>

<script>
import { createEqument } from "../../assets/axios/api"
import Select from "../../components/Select"
export default {
	data() {
		return {
			types: [
				{ text: "智能药盒", value: "智能药盒" },
				{ text: "智能手环", value: "智能手环" },
			],
			type: "智能药盒",
			identify: "",
			name: "",
			description: "",
		}
	},
	methods: {
		scan() {
			console.log("扫一扫")
		},
		save(e) {
			e.preventDefault()
			createEqument({
				type: this.type,
				identify: this.identify,
				name: this.name,
				description: this.description,
			}).then((res) => {
				let equments = this.$store.getters.getUser.equments
				equments.push(res.data.data)
				this.$store.commit("updateEqument", [...equments])
				this.$showToast({
					text: "添加成功",
				})
				this.$router.push({ name: "Equment" })
			})
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
      i
        z-index 2
        position absolute
        font-size 1.6em
        color var(--gray1)
        left 5px
      input
        margin 0
        width 100%
        padding-left 35px
        font-size 1em
        &:focus
          border-color var(--green)
        &:focus + i
          color var(--green)
          font-weight 500
      .scan
        position absolute
        margin 0
        padding 0
        top 0
        right 10%
    .description
      margin-top 15px
    button
      margin 10px 0
</style>
