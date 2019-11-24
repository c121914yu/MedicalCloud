<template>
	<view class="MyPlans">
		<view 
			class="plan-item"
			v-for="(plan,index0) in plans"
			:key="index0"
		>
			<view class="head">
				<text class="name">{{plan.EquipmentName}}</text>
				<text class="change" @click="Setplan(plan.PlanID)">编辑</text>
			</view>
			
			<view class="content">
				<view class="begin">
					{{plan.date.year}}/{{plan.date.month}}/{{plan.date.day}}开始,每
					<text class="frequency">{{plan.Frequency}}</text>天执行
				</view>
				
				<view 
					class="medical-info"
					v-for="(item,index1) in plan.MedicalInfo"
					:key="index1"
				>
					<view class="time">
						{{item.time}}
					</view>
										
					<view class="medicines">
						<view
							class="medical"
							v-for="(medical,index2) in item.Medicines"
							:key="index2"
						>
							<view class="dot" v-if="medical.remark != ''"></view>
							<view :class="medical.remark === '' ? 'none-remark':''">
								{{medical.name}}*{{medical.amount}}
							</view>
							<view 
								v-if="medical.remark"
								class="remark"
							>
								备注:{{medical.remark}}
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				plans : []
			}
		},
		onShow() {
			uni.showLoading({title:'读取中...'})
			this.plans = []
			this.InitInfo(global.UserPlans)
		},
		methods:{
			InitInfo(plans){
				plans.forEach(plan => {
					let UseTimes = JSON.parse(plan.UseTimes)
					let date = JSON.parse(plan.date)
					
					let EquipmentName = ''
					let MedicalInfo = new Array
					/*查询设备的药物*/
					if(plan.EquipmentID === '不使用设备'){
						EquipmentName = '不使用设备'
						MedicalInfo = UseTimes.map(time => {
							let Medicines = time.Medicines.map(item => {
								return {
									name : item.name,
									amount : item.amount,
									remark : item.remark
								}
							})
							return {
								Medicines,
								time : time.Hour+':'+time.Minute
							}
						})
					}
					else
						global.EquipmentsInfo.find(item => {//遍历整个设备
							if(item.ID === plan.EquipmentID){
								EquipmentName = item.name
								const medicalinfo = JSON.parse(item.MedicalInfo)
								const UseTimes = JSON.parse(plan.UseTimes)
			
								MedicalInfo = UseTimes.map(time => {//遍历使用时间
									const MedicalIndex = time.MedicalIndex
									let Medicines = []
									MedicalIndex.forEach(index => {//遍历选中药柜下标
										medicalinfo[index].forEach(medical => {//遍历对应药柜的信息
											Medicines.push({
												name : medical.name,
												amount : medical.amount,
												remark : medical.remark,
											})
										})
									})
									return {
										Medicines,
										time : time.Hour + ':' + time.Minute
									}
								})
							}//查询设备
							return item.ID === plan.EquipmentID
						})
					/*查询设备的药物结束*/
					this.plans.push({
						EquipmentName : EquipmentName,
						PlanID : plan.PlanID,
						date : date,
						Frequency : plan.Frequency,
						MedicalInfo : MedicalInfo
					})
				})
				uni.hideLoading()
			},
			Setplan(ID){
				let UserPlans=global.UserPlans
				let PlanIndex
				UserPlans.find((plan,index)=>{
					if(plan.PlanID==ID)
						PlanIndex=index
					return plan.PlanID==ID
				})
				uni.navigateTo({url: "AddPlan?PlanIndex="+PlanIndex})
			}
		}//methods结束
	}
</script>

<style>
	body{
		box-sizing: border-box;
		background: rgba(225,225,225,0.8);
		font-size: 17px;
	}
	
	.plan-item{
		width: 94%;
		background: #f4f4f4;
		box-shadow: 2px 2px 2px #b1b1b1;
		border-radius: 5px;
		margin: 15px auto;
	}
	
	.head{
		color: #4d4d4d;
		width: 94%;
		min-height: 30px;
		border-bottom: 1px solid rgba(210,210,210,0.5);
		margin: 0 auto;
		padding: 5px 0;
		display: flex;
		align-items: center;
		position: relative;
	}
	.head .name{
		margin-left: 10px;
	}
	.head .change{
		color: #088573;
		position: absolute;
		right: 10px;
		animation: rotate 2s infinite linear;
	}
	@keyframes rotate{
		0%{-webkit-transform:scale(1) rotate(0);}
		10%{-webkit-transform:scale(0.9)}
		30%,50%,70%,90%{-webkit-transform:scale(1.1) rotate(5deg);}
		40%,60%,80%{-webkit-transform:scale(1.1) rotate(-5deg);}
		100%{-webkit-transform:scale(1) rotate(0);}
	}
	
	.content{
		background: #088573;
		border-bottom-right-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	.content .begin{
		color: #dfdcdc;
		text-align: center;
	}
	.content .begin .frequency{
		color: #fdd930;
	}
	.content .medical-info{
		font-size: 17px;
		color: #fdd930;
		margin: 10px 0;
		display: flex;
		align-items: flex-start;
		overflow: hidden;
	}
	.content .medical-info .time{
		margin-left: 20px;
	}
	.content .medical-info .medicines{
		margin-left: 15px;
		line-height: 1.5;
		flex: 1;
	}
	.content .medical-info .medicines .dot{
		background: #FFFFFF;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.content .medical-info .medicines .medical{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.content .medical-info .medicines .medical .none-remark{
		margin-left: 16px;
	}
	.content .medical-info .medicines .medical .remark{
		color: #dfdcdc;
		font-size: 14px;
		line-height: 1;
		margin-left: 16px;
		margin-bottom: 7px;
		flex-basis:100%;
	}
</style>
