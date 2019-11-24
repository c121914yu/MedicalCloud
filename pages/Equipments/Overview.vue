<!-- EquipmentDetail头部概况组件 -->
<template>
	<view class="overview">
		<image src="../../static/logo.png" mode="widthFix"></image>
		<view class="overview-info">
			<view>
				 <cmd-progress :percent="power" status="active" stroke-width="15">
				 </cmd-progress>
			</view>
			
			<view>
				<text>计划数:</text>
				<text>{{Plans.sum}}</text>
			</view>
			
			<view>
				<text>未完成:</text>
				<text>{{Plans.unfinish}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"
	export default{
		data(){
			return{
				power:40,
			}
		},
		computed:{
			Plans(){//根据信息计算设备的计划数
				let statistics={sum:0,unfinish:0}
				let plans=global.UserPlans
				let EquipmentID=this.ParentInfo.ID
				plans.forEach(plan=>{
					if(plan.EquipmentID === EquipmentID){
						statistics.sum++
						if(plan.UnFinish != "0")
							statistics.unfinish++
					}
				})
				return statistics
			}
		},
		components:{
			cmdProgress,
		},
		props:{
			ParentInfo:Object
		}
	}
</script>

<style scoped>
	.overview{
		font-size: 17px;
		line-height: 1.8;
		width: 90%;
		margin: 15px auto;
		display: flex;
		align-items: center;
	}
	.overview image{
		width: 25%;
		height: auto;
		border-radius: 50%;
	}
	.overview-info{
		/* 设备总体情况(计划数，未完成) */
		width: 60%;
		margin-left: 20px;
	}
</style>
