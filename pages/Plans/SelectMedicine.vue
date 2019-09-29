<!-- 选择药柜 -->
<template>
	<view class="SelectMedicine" v-if="show">
		<view class="mask"></view>
		<view class="Popup">
			<view class="Title">{{EquipmentInfo.name}}药柜配置</view>
			<view class="Remark">点击可选择需要使用的药柜,长按可配置药柜信息</view>
			
			<uni-grid column="2" :showBorder="false" :highlight="false" :square="false">
				<uni-grid-item :class="medicines[0].active ? 'Active' : ''" v-for="(medicines,index1) in MedicalInfo" :key="index1"
					@tap="PitchMedical(medicines,index1)" @longpress="SetMedicineInfo(index1)" @touchstart="LongTap=false">
					<view class="medical">
						<view>药柜编号:{{index1+1}}</view>
						
						<block v-for="(medical,index2) in medicines" :key="index2">
							<view v-if="medical.name == ''">暂无存药</view>
							<view class="name" v-else>
								{{medical.name}}
							</view>
						</block>
	
					</view>
				</uni-grid-item>
			</uni-grid>
			
			<!-- 发送设备基本信息，药柜编号 -->
			<SetMedical v-if="SetMedical" @CloseSet="CloseSet" @UpdateMedicals="UpdateMedicals"
				:InitialInfo="InitialInfo">
				<!-- StaticInfo是初始的药柜信息，用于判断填写内容是否发生了变化 -->
			</SetMedical>
			
			<button type="primary" @click="finish">完成</button>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	import SetMedical from "../Equipments/SetMedical.vue"//设置药柜组件
	
	export default{
		data(){
			return{
				LongTap:false,
				SetMedical:false,
				
				InitialInfo:{}
			}
		},
		methods:{
			/* 短按选中药柜 */
			PitchMedical(medicines,index){
				if(!this.LongTap){
					if(medicines[0].name == '')
						uni.showToast({
							title: '药柜无存药',
							image:'../../static/error.png',
							duration:1000
						})
					else{//已填写过配药，点击则选中药柜
						let MedicalInfo=JSON.parse(this.EquipmentInfo.MedicalInfo)
						if(MedicalInfo[index][0].active === undefined)
							MedicalInfo[index][0].active = true
						else
							MedicalInfo[index][0].active = !MedicalInfo[index][0].active
						this.EquipmentInfo.MedicalInfo = JSON.stringify(MedicalInfo)
					}
				}
			},
			/* 长按配置药柜信息 */
			SetMedicineInfo(index){
				this.LongTap=true
				
				/* 去掉active属性 */
				let MedicalInfo = this.MedicalInfo.map(medicines => {
					delete medicines[0].active
					return medicines
				})
				this.EquipmentInfo.MedicalInfo = JSON.stringify(MedicalInfo)
				
				let InitialInfo={
					MedicalIndex:index,
					EquipmentID:this.EquipmentInfo.ID,
					MedicalInfo:MedicalInfo,
					EquipIndex:this.EquipIndex
				}
				this.InitialInfo=InitialInfo
				this.SetMedical=true
			},
			finish(){
				let ChoosingIndex=[]
				this.MedicalInfo.forEach((medicines,index)=>{
					if(medicines[0].active)
						ChoosingIndex.push(index)
				})
				this.$emit('ChooseMedicines',ChoosingIndex)
			},
			/* 关闭设置药柜 */
			CloseSet(){
				this.SetMedical=false
			},
			/* 更新药柜信息 */
			UpdateMedicals(MedicalInfo){
				this.EquipmentInfo.MedicalInfo = JSON.stringify(MedicalInfo)
			}
		},
		computed:{
			MedicalInfo(){	
				let EquipmentInfo=this.EquipmentInfo
				if(EquipmentInfo)
					return JSON.parse(EquipmentInfo.MedicalInfo)
				return []
			}
		},
		components:{
			uniGrid,
			uniGridItem,
			SetMedical
		},
		props:{
			show:Boolean,
			EquipmentInfo:Object,
			EquipIndex:Number
		}
	}
</script>

<style scoped>
	.Title{
		text-align: center;
		line-height: 1.8;
	}
	.Remark{
		text-align: center;
		font-size: 12px;
		color: #7b7b7b;
		line-height: 1.8;
	}
	.medical{
		/* 九宫格储药情况样式 */
		font-size: 15px;
		width: 80%;
		text-align: center;
		line-height: 1.7;
	}	
	/* 选中药柜背景加深 */
	.Active{
		background: rgba(8,133,115,0.4);
	}
	button{
		background:linear-gradient(-90deg,rgba(63,205,235,1),rgba(188,226,158,1));
		color: #FFFFFF;
		border-radius: 20px;
		width: 90%;
		margin: 5px auto;
	}
	
	/* 4宫格边框样式 */
	uni-grid-item:nth-child(1){
		border:1px solid #6fcdb2;
		border-left: none;
	}
	uni-grid-item:nth-child(2){
		border-top:1px solid #6fcdb2;
		border-bottom:1px solid #6fcdb2;
	}
	uni-grid-item:nth-child(3){
		border-right:1px solid #6fcdb2;
		border-bottom:1px solid #6fcdb2;
	}
	uni-grid-item:nth-child(4){
		border-bottom:1px solid #6fcdb2;
	}
</style>
