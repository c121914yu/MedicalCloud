<template>
	<view class="AllPlans">
		<view class="calendar">
			<!-- 日历插件 -->
			<uni-calendar
			:insert="true"
			:start-date="'2019-1-1'"
			:end-date="'2100-1-1'"
			@change="change"
			 />
		</view>
		<!-- 计划列表 -->
		<view class="PlansList">
			<view class="hint">点击可查看当天计划</view>
			
			<view class="NoneMedicine" v-if="TodayPlans.length==0">
				今天不需要用药
			</view>
			
			<view 
				class="Plan" 
				v-for="(plan,index) in TodayPlans" 
				:key="index"
			>		
				<!-- 时间部分 -->
				<view class="time">
					{{plan.time}}
				</view>
				<!-- 药物部分 -->
				<view class="medicines">	
					<view class="Medicine-item" v-for="(medical,index1) in plan.MedicalInfo" :key="index1">
						<view class="dot" v-if="medical.remark != ''"></view>
						<view :class="medical.remark === '' ? 'MedicalName' : ''" @click="SetPlan(medical.PlanID)">
							{{medical.name}} * {{medical.amount}}
						</view> 
						<view class="remark" v-if = "medical.remark != ''">备注:{{medical.remark}}</view>
					</view>
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniCalendar from "@/components/uni-calendar/uni-calendar"//日历插件
	
	var Plans
	export default{
		data(){
		 return {
			 TodayPlans:[]
		 }
		},
		methods:{
			change(e){
				/* 获取最新的Plan */
				this.UpdatePlans()
				/* 父级方法，更新选中日期 */
				this.$emit('UpdataChoosing',e)
				let today=e.fulldate
				let TodayPlans=[]
				
				/* 筛选选中日期含有的所有计划*/
				Plans.forEach(plan=>{
					/* 将计划日期转化成时间戳 */
					let StartDay=plan.date.year+'/'+plan.date.month+'/'+plan.date.day
					let DayInterval=this.DayInterval(StartDay,today)//计算日期间隔差
					/* 
						 当前日期为开始日期,DayInterval=0
						 在开始日期后,DayInterval>0
						 未到开始日期,DayInterval<0
					*/
				 if(DayInterval>=0){
					 /* 计划每天执行/当前日期即为计划开始日期 */
					 if(plan.Interval==1 || DayInterval==0)
						 TodayPlans.push(plan)
					 /* 选中日期与开始日期间隔是每n天执行的倍数时 */
					 else if(DayInterval%plan.Frequency==0)
						 TodayPlans.push(plan)
				 }
				})
				
				/* 获取筛选后计划的内容 */
				let PlansInfo=[]
				TodayPlans.forEach((plan,index)=>{
					/* 将时间遍历 */
					plan.UseTimes.forEach(info=>{
						let data={MedicalInfo:[]}
						let MedicalInfo={}
						/* 获取药物的名称 */
						if(plan.EquipmentID=="不使用设备"){
							MedicalInfo={
								name:plan.MedicalName,
								amount:info.amount,
								remark:info.remark,
								PlanID:plan.PlanID
							}
							data.MedicalInfo.push(MedicalInfo)
						}
						else{//使用设备，根据选中的药柜编号筛选出药名
							let index = this.FindEquipment(plan.EquipmentID)//获取设备的下标
							let Medicines = JSON.parse(global.EquipmentsInfo[index].MedicalInfo)
							let MedicalIndex = JSON.parse(plan.MedicalIndex)//获取选中的药柜编号
							
							/* 将选中的药柜进行遍历,并从中获取所有的药名 */
							MedicalIndex.forEach(item => {
								Medicines[item].forEach(medical => {
									MedicalInfo={
										name:medical.name,
										amount:medical.amount,
										remark:medical.remark,
										PlanID:plan.PlanID
									}
									if(MedicalInfo.name != '')
										data.MedicalInfo.push(MedicalInfo)})		
							})
						}
						/* 获取时间 */
						data.time=info.Hour+":"+info.Minute

						PlansInfo.push(data)
					})
				})
				/* 相同时间合并 */
				for(let a=0;a<PlansInfo.length-1;a++)
					for(let b=a+1;b<PlansInfo.length;b++)
						if(PlansInfo[a].time == PlansInfo[b].time){
							PlansInfo[a].MedicalInfo=PlansInfo[a].MedicalInfo.concat(PlansInfo[b].MedicalInfo)
							PlansInfo.splice(b,1)
							--b
						}
				/* 数组按时间排序 */
				let WeeHour=new Date('2019/9/25 00:00:00')//获取0点时间戳
				for(let a = 0;a < PlansInfo.length-1;a++)
					for(let b =a+1;b<PlansInfo.length;b++){
						let timeA=new Date('2019/9/25 '+PlansInfo[a].time+':00')-WeeHour
						let timeB=new Date('2019/9/25 '+PlansInfo[b].time+':00')-WeeHour
						if(timeA>timeB){
							let item=PlansInfo[a]
							PlansInfo[a]=PlansInfo[b]
							PlansInfo[b]=item
						} 
					}
					
				this.TodayPlans=PlansInfo
				console.log(this.TodayPlans)
			},
			
			/* 计算两个日期的天使差,2019-8-24格式 */
			DayInterval(sDate1, sDate2){ 
			    var aDate, StartDay, today, iDays
			    aDate = sDate1.split("-")
			    StartDay = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])//转换为9-25-2017格式 
			    aDate = sDate2.split("-")
			    today = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])//转换为9-25-2017格式 
			    iDays = parseInt(Math.abs(StartDay - today) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
			    if((today-StartDay)<0)
						iDays=-iDays
				return iDays
			},
			/* 根据ID获取设备的index */
			FindEquipment(ID){
				let EquipmentIndex
				global.EquipmentsInfo.find((item,index)=>{
					if(item.ID==ID)
						EquipmentIndex=index
				})
				return EquipmentIndex
			},
			/* 点击药名进入计划管理 */
			SetPlan(ID){
				let UserPlans=global.UserPlans
				let PlanIndex
				UserPlans.find((plan,index)=>{
					if(plan.PlanID==ID)
						PlanIndex=index
					return plan.PlanID==ID
				})
				uni.navigateTo({url: "Plans/AddPlan?PlanIndex="+PlanIndex})
			},
			
			UpdatePlans(){//将计划中字符串格式转化成对象或数组
				Plans=global.UserPlans.map(plan=>{
					let data={
						PlanID:plan.PlanID,
						EquipmentID:plan.EquipmentID,
						Frequency:plan.Frequency,
						MedicalIndex:plan.MedicalIndex,
						MedicalName:plan.MedicalName,
						UseTimes:JSON.parse(plan.UseTimes),
						date:JSON.parse(plan.date),
						phone:plan.phone
					}
					return data
				})
			}
		},
		components:{
			uniCalendar
		}
	}
</script>

<style>
	/* 日历表样式*/
	.calendar{
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
		box-shadow:2px 2px 5px #7b7b7b;
	}
	.PlansList{
		background: #088573;
		width: 86%;
		margin: 0 auto;
		box-shadow: 2px 2px 2px #b1b1b1;
		border-bottom-right-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	/* 提示内容 */
	.hint{
		text-align: center;
		font-size: 13px;
		color: #dfdcdc;
		padding-top: 5px;
	}
	/* 没有计划内容,提醒无计划 */
	.NoneMedicine{
		color: #fdd930;
		font-size: 20px;
		text-align: center;
		padding: 10px;
	}
	/* 计划内容 */
	.Plan{
		color: #fdd930;
		font-size: 17px;
		margin: 15px 0;
		display: flex;
		align-items: flex-start;
		overflow: hidden;
	}
	.Plan .time{
		margin-left: 20px;
	}
	.Plan .medicines{
		margin-left: 15px;
		line-height: 1.5;
	}
	.Plan .Medicine-item{
		flex: 1;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.Plan .dot{
		background: #FFFFFF;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.Plan .MedicalName{
		margin-left: 16px;
	}
	.Plan .remark{
		color: #dfdcdc;
		font-size: 13px;
		line-height: 1;
		margin-left: 16px;
		margin-bottom: 7px;
		flex-basis:100%;
	}
</style>
