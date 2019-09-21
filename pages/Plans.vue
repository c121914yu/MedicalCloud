<template>
	<view class="Plans">
		<view>
			<AllPlans ref="BackToday" @UpdataChoosing='UpdataChoosing'></AllPlans>
		</view>
		
		<navigator url="Plans/AddPlan?PlanIndex=false" hover-class="none">
			<image class="AddPlan"
				src="../static/Plans/AddPlan.png" mode="widthFix"/>
		</navigator>
	</view>
</template>

<script>
	import AllPlans from './Plans/AllPlans'
	
	export default{
		data(){
			return{
				ChoosingDate:''
			}
		},
		onShow(){
			/* 
			 组件change触发后返回一个选中的日期,当界面再次展示时,会调用子组件change函数来更新当前选中日期计划
			*/
			this.$refs.BackToday.change(this.ChoosingDate)
		},
		methods:{
			UpdataChoosing(e){
				this.ChoosingDate=e
			}
		},
		components:{
			AllPlans
		}
	}
</script>

<style>
	.AddPlan{
		width: 50px;
		position: fixed;
		right: 1%;
		bottom: 3%;
		z-index: 999;
	}
</style>
