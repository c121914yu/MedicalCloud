<template>
	<view class="Detail">	
		<!-- 设备图片，电量，计划数，未完成计划， -->
		<Overview :ParentInfo="ChildrenInfo.EquipmentInfo"></Overview>
		
		<!-- 储药情况药物一览 -->
		<view class="Title">
			<h2>储药情况</h2>
			<text>背景加深表示该药柜含计划,请谨慎修改</text>
		</view>
		
		<view class="medicines">
			<view
				class="medical"
				:class="Active(index1) ? 'active' : ''"
				v-for="(medicines,index1) in MedicalInfo" 
				:key="index1" 
				@click="ClickMedical(index1)"
			>
				<view>药柜编号:{{index1+1}}</view>
				
				<block v-for="(medical,index2) in medicines" :key="index2">
					<view v-if="medical.name == ''">暂无存药</view>
					<view class="name" v-else>
						{{medical.name}}
					</view>
				</block>
			</view>
		</view>
		<!-- 设置药物组件 -->
		
		<!-- 发送设备基本信息，药柜编号 -->
		<SetMedical v-if="SetMedical" @CloseSet="CloseSet" @UpdateMedicals="UpdateMedicals"
			:InitialInfo="SetMedInfo">
			<!-- StaticInfo是初始的药柜信息，用于判断填写内容是否发生了变化 -->
		</SetMedical>
		
		<!-- 类型，标识码（不可改）,名称，备注 -->
		<h2>设备信息</h2>
		<EquipmentInfo :info="ChildrenInfo"></EquipmentInfo>
		
		<button class="remove" type="warn" @click="Remove">删除设备</button>
	</view>
</template>

<script>	
	import Overview from "./Overview"//引入头部概述组件
	import SetMedical from"./SetMedical"//引入配置药物信息组件
	import EquipmentInfo from"./EquipmentInfo"//引入设备基本信息
	
	var Equipment,EquipIndex
	export default{
		data(){
			return{
				SetMedInfo:{},//设置药柜时传所有药物信息,药柜编号和设备基本信息过去
				SetMedical:false,
				MedicalIndex : [],//有计划的药柜编号
				MedicalInfo:[],//结构:数组->数组->对象
				
				ChildrenInfo:{//传给设备信息组件的信息
					BtnText:'修改信息',
					LoadingText:'修改信息中',
					PostSrc:'https://jinlongyuchitang.cn:4000/AmendInfo',
					SuccessText:'修改信息成功',
					change:true,
					EquipmentInfo:{},
					index:''
				},
			}
		},
		onLoad(e) {
			EquipIndex=e.index
			Equipment = global.EquipmentsInfo[EquipIndex]
			if(global.PlanEquipment(Equipment.ID))
				this.MedicalIndex = global.PlanEquipment(Equipment.ID).MedicalIndex
			this.MedicalInfo=JSON.parse(Equipment.MedicalInfo)
			
			this.ChildrenInfo.EquipmentInfo=Equipment
			this.ChildrenInfo.index=EquipIndex
		},
		methods:{
			ClickMedical(index){//点击药柜，进入单个药柜设置
				let SendInfo={
					MedicalIndex:index,
					EquipmentID:Equipment.ID,
					MedicalInfo:this.MedicalInfo,
					EquipIndex:EquipIndex,
					active : this.Active(index)
				}
				this.SetMedInfo=SendInfo
				this.SetMedical=!this.SetMedical
			},
			/* 删除设备按键 */
			Remove(){
				if(this.MedicalIndex.length > 0)
					uni.showToast({
							title:'正在执行计划',
							image:"../../static/error.png",})
				else
					uni.showModal({
						title: '提示',
						content: '确定删除设备?',
						confirmColor:"#e42020",
						success: res => {
							if(res.confirm)
								uni.request({
									url: 'https://jinlongyuchitang.cn:4000/RemoveEquipment',
									method: 'POST',
									data: {ID:Equipment.ID},
									success: (res) => {
										global.EquipmentsInfo.splice(EquipIndex,1)
										uni.navigateBack({
											delta: 1,
											success(){uni.showToast({title: '删除设备成功'})}})
									},
									fail(err) {console.log(err)}})//request请求成功结束
						}})
			},//Remove结束
			
			/* 关闭设置药柜 */
			CloseSet(e){
				this.SetMedical=false
			},
			/* 更新药柜信息 */
			UpdateMedicals(MedicalInfo){
				this.MedicalInfo=MedicalInfo
			},
			/* 判断哪个药柜含计划 */
			Active(index){
				let active = false
				this.MedicalIndex.find(item => {
					if(item === index){
						active = true
						return true
					}
				})
				return active
			}
		},//methods结束
		components:{
			EquipmentInfo,
			Overview,
			SetMedical
		}
	}
</script>

<style scoped>
	h2{
		font-size: 20px;
		line-height: 1.8;
		margin-left: 5%;
	}
	
	.Title{
		display: flex;
		align-items: center;
	}
	.Title text{
		color: #da1a1a;
		font-size: 12px;
		margin-left: 10px;
	}
	
	/* 储药情况样式 */
	.medicines{
		min-height: 191px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.medical{
		box-sizing: border-box;
		font-size: 15px;
		width: 50%;
		text-align: center;
		line-height: 1.7;
		padding: 5px 0;
	}
	.medical .name{
		width: 98%;
		margin: 0 auto;
		white-space: nowrap;
		overflow: hidden;
	}
	.medical:nth-child(1){
		border-top: 1rpx solid #088573;
		border-right: 1rpx solid #088573;
		border-bottom: 1rpx solid #088573;
	}
	.medical:nth-child(2){
		border-top: 1rpx solid #088573;
		border-bottom: 1rpx solid #088573;
	}
	.medical:nth-child(3){
		border-right: 1rpx solid #088573;
		border-bottom: 1rpx solid #088573;
	}
	.medical:nth-child(4){
		border-bottom: 1rpx solid #088573;
	}
	
	/* 选中药柜背景加深 */
	.active{
		background: rgba(8,133,115,0.4);
	}
	
	/* 删除按键 */
	.remove{
		width: 95%;
		border-radius: 20px;
		margin: 10px auto;
	}
</style>
