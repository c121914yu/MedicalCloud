<template>
	<view class="Equipments">
		<!-- 所有设备的整体情况，6宫格，总数，正常，警告，有计划的，完成计划，未完成计划 -->
		<uni-grid class="condition" column="3" :highlight="highlight" :showBorder="showBorder">
			<uni-grid-item style="border-right:1px solid #e4e4e4;border-bottom:1px solid #e4e4e4;">
        <view>总数</view> 
				<view>{{EquipmentsAmount}}</view>
			</uni-grid-item>
			<uni-grid-item style="border-right:1px solid #e4e4e4;border-bottom:1px solid #e4e4e4;">
					<view>正常</view>
					<view>{{NormalEquipment}}</view>
			</uni-grid-item>
			<uni-grid-item style="border-bottom:1px solid #e4e4e4;">
					<view>异常</view>
					<view>{{EquipmentsAmount-NormalEquipment}}</view>
			</uni-grid-item>
			<uni-grid-item style="border-right:1px solid #e4e4e4;">
					<view>含计划设备</view>
					<view>{{PlansEquipment}}</view>
			</uni-grid-item>
			<uni-grid-item style="border-right:1px solid #e4e4e4;">
					<view>设备计划总数</view>
					<view>5</view>
			</uni-grid-item>
			<uni-grid-item>
					<view>未完成计划</view>
					<view>{{UnFinish}}</view>
			</uni-grid-item>
		</uni-grid>
		
		<!-- 设备总览，图例，图片+名称 -->
		<view class="Header">
			<h2>设备总览</h2>
			<navigator url="NewEquipment" hover-class="none">添加新设备</navigator>
		</view>
		
		<uni-grid class="All" column="3" :showBorder="showBorder" :square="square" :highlight="highlight">
			<uni-grid-item v-for="(equipment,index) in equipments" :key="index" >
				<navigator :url="'EquipmentDetail?index='+index " hover-class="none">
					<image src="../../static/logo.png" mode="widthFix"></image>
					<view class="name">{{equipment.name}}</view>
					<view>状态:{{equipment.condition}}</view>
				</navigator>
			</uni-grid-item>
		</uni-grid>
		
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	export default{
    components: {
			uniGrid,uniGridItem
		},
		data(){
			return{
				showBorder:false,
				square:false,
				highlight:false,
				equipments:[]
			}
		},
		onShow() {
			this.equipments=global.EquipmentsInfo
		},
		computed:{
			EquipmentsAmount(){//计算设备总数
				return this.equipments.length
			},
			NormalEquipment(){
				return this.equipments.reduce((sum,equipment)=>{
					if(equipment.condition=="正常")
						return ++sum
					return sum
				},0)
			},
			PlansEquipment(){
				let plans=global.UserPlans
				let sum=0
				plans.forEach(plan=>{
					if(plan.EquipmentID!="不使用设备")
						sum++
				})
				return sum
			},
			UnFinish(){
				let sum=0
				let plans=global.UserPlans
				plans.forEach(plan=>{
					if(plan.UnFinish=="1")
						sum++
				})
				return sum
			}
		}
	}
</script>

<style scoped>
	.condition{
		color: #747474;
		line-height: 1.8;
		font-size: 18px;
	}
	h2{
		color: #676060;
		padding: 10px;
	}
	.Header{
		width: 90%;
		margin: 0 auto;
		line-height: 1.8;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.Header navigator{
		font-size: 15px;
		color: rgba(107,109,110,0.8);
		margin-right: 10px;
	}
	.All{
		color: #747474;
		line-height: 1.5;
		font-size: 15px;
		text-align: center;
		height: auto;
	}
	.All .name{
		width: 80%;
		margin: 0 auto;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	image{
		width: 50%;
		height: auto;
		margin: 0 25%;
	}
	.All navigator{
		width: 100%;
	}
</style>
