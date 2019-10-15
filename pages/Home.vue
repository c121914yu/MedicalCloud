<template>
	<view class="Home">
		<!-- 推送健康文章 -->
		<PushArticle></PushArticle>
		<!-- 我的设备 -->
		<Equipment :EquipmentInfo="EquipmentInfo"></Equipment>
		<!-- 身体指数 -->
		<BodyInfo></BodyInfo>
	</view>
</template>
  
<script>
	import PushArticle from './HomeComponents/PushArticle.vue'
	import Equipment from'./HomeComponents/Equipment.vue'
	import BodyInfo from './HomeComponents/BodyInfo.vue'
	
	export default{
		data(){
			return{
				EquipmentInfo:[]
			}
		},
		onLoad() {
			uni.showLoading({title: '加载中'})
		},
		onShow() {
			this.EquipmentInfo=global.EquipmentsInfo
		},
		onReady() {
			uni.hideLoading()
		},
		components:{
			PushArticle,Equipment,BodyInfo
		}
	}
</script>

<style>
	body{
		box-sizing: border-box;
	}
	/*隐藏滚动条*/
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
</style>
