<template>
	<view>
		<view class="list" v-for="(item,index) in UndoPlans" :key="index">
			<view class="time">{{item.Time}}</view>
			<view class="name">{{item.Medical}}</view>
			<image src="../../static/Plans/delete.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				UndoPlans:[
					{Time:'2019/9/11,7:00',Medical:'小柴胡颗粒,阿莫西林'},
					{Time:'2019/9/11,12:00',Medical:'小柴胡颗粒,阿莫西林'}
				]
			}
		},
		onLoad() {
			let Plans=global.UserPlans.map(plan=>{
				let data={
					PlanID:plan.PlanID,
					EquipmentID:plan.EquipmentID,
					Interval:plan.Interval,
					MedicalIndex:plan.MedicalIndex,
					MedicalName:plan.MedicalName,
					UseTimes:JSON.parse(plan.UseTimes),
					date:JSON.parse(plan.date),
					phone:plan.phone
				}
				return data
			})
			console.log(global.UserPlans)
		}
	}
</script>

<style>
	body{
		color: #f4f4f4;
		font-size: 15px;
		box-sizing: border-box;
	}
	.list{
		background: #088573;
		box-shadow: 1.5px 1.5px 2px #9a9a9a;
		line-height: 1.5;
		width: 95%;
		min-height: 50px;
		margin: 5px auto;
		border-radius: 10px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.time{
		width: 100%;
		margin-left: 5px;
	}
	.name{
		max-width: 70%;
		margin-left: 5px;
		flex-wrap: wrap;
	}
	.list image{
		width: 30px;
		position: absolute;
		margin-left: 80%;
	}
</style>
