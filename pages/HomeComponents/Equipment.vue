<!-- 我的设备组件 -->
<template>
	<view class="MyEquipment">
		<view class="Header">
			<h3>我的设备</h3>
		</view>
		
		<scroll-view class="scroll" scroll-x="true">
			<view class="equipment" v-for="(equipment,index) in EquipmentInfo" :key="index" @click="EquimentDetail(equipment.ID,index)">
				<image class="equipment-src" src='../../static/logo.png' mode="widthFix"></image>
				<view class="name">{{equipment.name}}</view>
			</view>
			
			<navigator class="equipment" hover-class="none" url="Equipments/NewEquipment">
				<image class="add" src='../../static/add.png' mode="widthFix"></image>
				<view class="name">添加设备</view>
			</navigator>
		</scroll-view>
		
	</view>
</template>

<script>
	export default{
		name:'Equipment',
		data(){
			return{}
		},//data结束
		methods:{
			EquimentDetail(ID,index){//跳转设备详细
				uni.navigateTo({url: 'Equipments/EquipmentDetail?index='+index})
			},
		},//methods结束
		props:{
			EquipmentInfo:Array
		}
	}
</script>

<style>
	page{
		background: rgba(220,222,223,0.3);
	}
	image{
		height: auto;
	}
	.MyEquipment{
		width: 90%;
		margin: 0 auto;
	}
	.Header{
		line-height: 1.8;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.Header navigator{
		font-size: 14px;
		color: rgba(107,109,110,0.8);
		margin-right: 5px;
	}
	.Header h3{
		color: #58595a;
	}
	.scroll{
		color: #58595a;
		white-space: nowrap;
		min-height: 120px;
	}
	.equipment{
		width: 25%;
		display: inline-block;
	}
	.equipment-src{
		/* 设备照片 */
		width:80%;
		height: auto;
		margin: 0 10%;
	}
	.equipment .name{
		width: 100%;
		font-size: 17px;
		text-align: center;
		overflow: hidden;
	}
	.add{
		width: 50%;
		margin: 15% 25%;
	}
</style>
