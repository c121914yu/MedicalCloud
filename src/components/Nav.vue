<template>
	<div class="Nav">
		<div v-if="isBottom" class="navs-bottom">
			<router-link
				class="item"
				:class="index === activeNav ? 'active' : ''"
				v-for="(item, index) in navs"
				:key="index"
				:to="{ name: item.name }"
			>
				<i :class="'iconfont icon-' + item.icon"></i>
				<span>{{ item.text }}</span>
			</router-link>
		</div>
		<div v-else class="navs-top">
			<i class="iconfont icon-back" @click="$router.go(-1)"></i>
			<span>{{ titleText }}</span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isBottom: true,
			navs: [
				{ text: "提醒", icon: "remind", name: "Remind" },
				{ text: "设备", icon: "equment", name: "Equment" },
				{ text: "记录", icon: "record", name: "Record" },
				{ text: "个人", icon: "user", name: "User" },
			],
			topNavsName: [
				{ name: "EditRemind", text: "编辑计划" },
				{ name: "Phone", text: "手机设置" },
				{ name: "Email", text: "邮箱设置" },
				{ name: "MedicalBox", text: "药盒配置" },
				{ name: "AddEqument", text: "添加设备" },
				{ name: "SetUser", text: "切换用户" },
				{ name: "Case", text: "电子病例" },
				{ name: "Report", text: "体检报告" },
				{ name: "Introduction", text: "电子说明书" },
				{ name: "UsingHelp", text: "使用帮助" },
			],
			activeNav: 0,
			titleText: "",
		}
	},
	watch: {
		$route: "routeChange",
	},
	methods: {
		routeChange() {
			let name = this.$route.name
			this.activeNav = this.navs.findIndex((item) => {
				if (item.name === name) return true
			})

			if (this.activeNav != -1) this.isBottom = true
			else {
				this.topNavsName.find((item) => {
					if (item.name === name) {
						this.titleText = item.text
						return true
					}
				})
				this.isBottom = false
			}
		},
	},
	mounted() {
		this.routeChange()
	},
}
</script>

<style lang="stylus" scope>
.Nav
  z-index 10
  user-select none
  .navs-bottom
    position fixed
    bottom 0
    width 100vw
    background-color #fff
    padding 10px 0
    border-top var(--border1)
    display flex
    align-items center
    justify-content space-around
    .item
      text-decoration none
      cursor pointer
      display flex
      flex-direction column
      align-items center
      &.active
        color var(--green)
      i
        font-size 1em
  .navs-top
    position fixed
    top 0
    left 0
    width 100%
    height 50px
    display flex
    align-items center
    justify-content center
    background-color var(--green)
    color #f4f4f4
    font-size 1.2em
    filter brightness(110%)
    span
      letter-spacing 2px
    i
      display block
      position absolute
      left 20px
      font-weight 700
</style>
