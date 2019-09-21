<!-- 选择药柜 -->
<template>
	<view class="SelectMedicine" v-if="show">
		<view class="mask"></view>
		<view class="Popup">
			<view class="Title">{{EquipmentInfo.name}}药柜配置</view>
			<view class="Remark">点击可选择需要使用的药柜,长按可配置药柜信息</view>
			
			<uni-grid column="3" :showBorder="false" :highlight="false">
				<uni-grid-item :class="medical.active ? 'Active':''" v-for="(medical,index) in Medicines" :key="index"
				  @tap="PitchMedical(medical,index)" @longpress="SetMedicineInfo(index)" @touchstart="LongTap=false">
					<view class="medical">
						<view>药柜编号:{{index+1}}</view>
						<view >{{medical.name == '' ? '暂无存药':medical.name}}</view>
						<view>{{medical.amount == '' ? '':"数量:"+medical.amount}}</view>
					</view>
				</uni-grid-item>
			</uni-grid>
			
			<!-- 发送设备基本信息，药柜编号 -->
			<SetMedicine :show="SetMedicine" @CloseSet="CloseSet" @UpdateMedicals="UpdateMedicals"
				:InitialInfo="InitialInfo" :StaticInfo="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex]">
				<!-- StaticInfo是初始的药柜信息，用于判断填写内容是否发生了变化 -->
			</SetMedicine>
			
			<button type="primary" @click="finish">完成</button>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	import SetMedicine from "../Equipments/SetMedical.vue"//设置药柜组件
	
	export default{
		data(){
			return{
				LongTap:false,
				SetMedicine:false,
				InitialInfo:{}
			}
		},
		methods:{
			/* 短按选中药柜 */
			PitchMedical(medical,index){
				if(!this.LongTap){
					if(medical.name=='')
						uni.showToast({
							title: '药柜无存药',
							image:'../../static/error.png',
							duration:1000
						})
					else{
						let Medicines=JSON.parse(this.EquipmentInfo.MedicalInfo)
						if(Medicines[index].active==false || Medicines[index].active==undefined)
							Medicines[index].active=true
						else
							Medicines[index].active=false
						this.EquipmentInfo.MedicalInfo=JSON.stringify(Medicines)
					}
				}
			},
			/* 长按配置药柜信息 */
			SetMedicineInfo(index){
				this.LongTap=true
				let medicines=this.Medicines.map(medicine=>{
					delete medicine.active
					return medicine
				})
				let SendInfo={
					MedicalIndex:index,
					EquipmentName:this.EquipmentInfo.name,
					EquipmentID:this.EquipmentInfo.ID,
					MedicalInfo:medicines,
					EquipIndex:this.EquipIndex
				}
				this.InitialInfo=SendInfo
				this.SetMedicine=true
			},
			finish(){
				let Medicines=JSON.parse(this.EquipmentInfo.MedicalInfo)
				let ChoosingIndex=[]
				Medicines.forEach((medicine,index)=>{
					if(medicine.active)
						ChoosingIndex.push(index)
				})
				this.$emit('ChooseMedicines',ChoosingIndex)
			},
			/* 关闭设置药柜 */
			CloseSet(){
				this.SetMedicine=false
			},
			/* 更新药柜信息 */
			UpdateMedicals(medicals){
				let Medicals=JSON.stringify(medicals)
				this.EquipmentInfo.MedicalInfo=Medicals
			}
		},
		computed:{
			Medicines(){	
				let EquipmentInfo=this.EquipmentInfo
				if(EquipmentInfo)
					return JSON.parse(EquipmentInfo.MedicalInfo)
				return []
			}
		},
		components:{
			uniGrid,
			uniGridItem,
			SetMedicine
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
	
	/* 九宫格边框样式 */
	uni-grid-item:nth-last-child(1){
		border:1px solid #6fcdb2;
		border-right: none;
	}
	uni-grid-item:nth-last-child(2){
		border:1px solid #6fcdb2;
		border-right: none;
	}
	uni-grid-item:nth-last-child(3){
		border-top: 1px solid #6fcdb2;
		border-bottom: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(4){
		border-top: 1px solid #6fcdb2;
		border-left: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(5){
		border-top: 1px solid #6fcdb2;
		border-left: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(6){
		border-top: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(7){
		border-top: 1px solid #6fcdb2;
		border-left: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(8){
		border-top: 1px solid #6fcdb2;
		border-left: 1px solid #6fcdb2;
	}
	uni-grid-item:nth-last-child(9){
		border-top: 1px solid #6fcdb2;
	}
</style>
