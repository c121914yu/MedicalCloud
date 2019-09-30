<template>
	<view class="AddPlan">
		<Picker v-if="Picker"  :type="type" :value="value" :EquipmentIndex="EquipmentIndex"
			:Items1="Items1" :Items2="Items2" :Items3="Items3" :TimeInfo="TimeInfo"
		 :InitialText="InitialText" @FinishPic="FinishPic" @Close="Close">
		</Picker>
		
		<view class="info">
			<view>使用设备：</view>
			<view @click="PickerEquipment">{{CurrentText[0]}}</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<!-- 不需要设备,直接填写药名 -->
		<view class="info" v-if="!EquipmentIndex[0]">
			<view>药物名称：</view>
			<input type="text" v-model="MedicalName" placeholder="药物名称" />
		</view>
		<!-- 需要设备,选择对应的药柜 -->
		<view class="info" v-else>
			<view>选择药柜：</view>
			<view class="Medicines" @click="PicMedicine">
				<view v-if="MedicalIndex.length==0">配置药柜</view>
				<view v-for="(item,index) in MedicalIndex" :key="index">药柜{{item+1}}</view>
			</view>
		</view>
		<!-- 配置药柜组件 -->
		<SelectMedicine :show="SelectMedicine" @ChooseMedicines="ChooseMedicines"
			:EquipmentInfo="EquipmentInfo[EquipmentIndex[0]-1]" :EquipIndex="EquipmentIndex[0]-1">
		</SelectMedicine>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="info">
			<view>开始日期：</view>
			<view @click="PickerDate">
				{{CurrentText[1]==Today ? '今天' : CurrentText[1]}}
			</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="info">
			<view>计划频率：</view>
			<view @click="PickerFrequency">{{CurrentText[2]}}</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="info" style="border: none;">
			<view>用药时间</view>
		</view>
		
		<view class="UseTime" @click="PickerTimes('Change',usetime)" @longpress="RemoveTime(index)"
			v-for="(usetime,index) in UseTimes" :key="index">
			<view class="time">{{usetime.Hour+":"+usetime.Minute}}</view>
			<view class="content">
				<view>
					<text style="color:#7b7b7b;">用量：</text>
					<text>{{usetime.amount}}</text>
				</view>
				<view>
					<text style="color:#7b7b7b;">备注：</text>
					<text>{{usetime.remark}}</text>
				</view>
			</view>
		</view>
		
		<view @click="PickerTimes('Add')">
			<image class="AddTime" src="../../static/Plans/AddTime.png" mode="widthFix"/>
		</view>
		
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="reminder">
			<view></view>
		</view>
		
		<view style="display: flex;justify-content: space-between;padding: 10px 0;">
			<button class="remove" v-if="ChangePlan" @click="Remove">删除</button>
			<button class="sure" @click="Sure">确认</button>
		</view>
	</view>
</template>

<script>
	import Picker from './Picker'//引入选择自定义组件
	import SelectMedicine from './SelectMedicine'//选择药柜组件
	
	var plan
	var Equipments,UseEquipments=["不使用设备"]
	var DateList=[],Today,DayList=[]
	var FrequencyList=[]
	var TimesList=[]
	export default{
		data(){			
			return{
				ChangePlan:false,
				SelectMedicine:false,
				
				EquipmentInfo:{},
				MedicalName:'',
				MedicalIndex:[],
				Today:'',
				UseTimes:[],
				/* 选择器参数 */
				Picker:false,
				type:'',
				InitialText:'',
				CurrentText:[UseEquipments[0],'今天','每天执行'],
				
				TimeInfo:{},
				value:[],//下标的值
				Items1:[],//发送给选择题的数组内容
				Items2:[],
				Items3:[],
				
				EquipmentIndex:[0],//设备的下标
				DateIndex:[0,0,0],//日期下标
				FrequencyIndex:[0]//频率下标
				/* 选择器参数 */
			}
		},
		onLoad(e) {
			this.SetUseEquipments()
			this.SetDateList()
			this.SetFrequency()
			this.SetTimes()
			/* 如果是管理界面来初始化数据 */
			if(e.PlanIndex!="false")
				this.SetChangeData(e.PlanIndex)
		},
		methods:{
			PickerEquipment(){//选择设备
				this.type='选择设备'
				this.Items1=UseEquipments
				this.Items2=[]
				this.Items3=[]
				this.InitialText=this.CurrentText[0]
				this.value=this.EquipmentIndex
				this.Picker=true
			},
			PicMedicine(){//配置药柜
				this.SelectMedicine=true
			},
			PickerDate(){//选择日期
				this.type="选择日期"
				this.Items1=DateList[0]
				this.Items2=DateList[1]
				this.Items3=DayList
				this.InitialText=this.CurrentText[1]
				this.value=this.DateIndex
				this.Picker=true
			},
			PickerFrequency(){//选择频率
				this.type="选择频率"
				this.Items1=FrequencyList
				this.Items2=[]
				this.Items3=[]
				this.InitialText=this.CurrentText[2]
				this.value=this.FrequencyIndex
				this.Picker=true
			},
			PickerTimes(type,usetime={}){//选择用药时间
				this.Items1=TimesList[0]
				this.Items2=TimesList[1]
				this.Items3=[]
				this.Picker=true
				/* 如果是修改的,把已经选中的时间传过去 */
				if(type=="Change"){
					/* 计算时间下标 */
					let Hour,Minute
					TimesList[0].find((e,index)=>{
						Hour=index
						return e==usetime.Hour
					})
					TimesList[1].find((e,index)=>{
						Minute=index
						return e==usetime.Minute
					})
					/* 计算时间下标 */		
					this.type="修改时间"
					this.InitialText=usetime.Hour+":"+usetime.Minute
					this.TimeInfo=usetime
					this.value=[Hour,Minute]
				}
				else{//新增时间
					let TimeInfo={
						index:this.UseTimes.length,
						amount:'',
						remark:''
					}
					this.type="添加时间"
					this.InitialText="07:00"
					this.TimeInfo=TimeInfo
					this.value=[7,0]
				}
			},
			RemoveTime(index){
				this.UseTimes.splice(index,1)
			},
			
			/* 确认添加计划按键 */
			Sure(){
				/* 获取选择的设备 */
				let EquipmentID
				if(this.EquipmentIndex[0]==0)
					EquipmentID="不使用设备"
				else
					EquipmentID=Equipments[this.EquipmentIndex-1].ID
				/* 获取日期 */
				let date=JSON.stringify({
					year:DateList[0][this.DateIndex[0]],
					month:DateList[1][this.DateIndex[1]],
					day:DateList[2][this.DateIndex[2]]
				}) 
				/* 获取使用频率 */
				let Frequency=FrequencyList[this.FrequencyIndex[0]]
				
				/* 判断填写内容是否有误 */
				if(this.EquipmentIndex[0]==0 && this.MedicalName=='')
					this.showtoast("请输入药名")
				else if(this.EquipmentIndex[0]!=0 && this.MedicalIndex.length==0)
					this.showtoast("请选择药柜")
				else if(this.UseTimes.length==0)
					this.showtoast("请选择时间")
				else{
					/* 发送数据给服务器 */
					let data={
						phone:global.UserLoginInfo.phone,
						EquipmentID:EquipmentID,
						MedicalName:this.MedicalName,
						MedicalIndex:JSON.stringify(this.MedicalIndex),
						date:date,
						Frequency:Frequency,
						UseTimes:JSON.stringify(this.UseTimes)
					}
					let Request=(url,text)=>{
						uni.request({
							url: 'http://49.232.38.113:4000'+url,
							method: 'POST',
							data: data,
							success: res => {
								global.GetPlans(global.UserLoginInfo.phone,true,text)
							},
							fail: (err) => {console.log(err)},
						})
					}
					if(this.ChangePlan){
						data.PlanID=plan.PlanID
						Request('/ChangePlan','修改计划成功')
					}
					else
						Request('/AddPlan','添加计划成功')				
				}
				/* 发送数据给服务器 */
			},
			/* 删除计划 */
			Remove(){
				uni.showModal({
					title: '提示',
					content: '确认删除计划?',
					success: res => {
						if(res.confirm)
							uni.request({
								url: 'http://49.232.38.113:4000/RemovePlan',
								method: 'POST',
								data:{PlanID:plan.PlanID},
								success: res => {
									global.GetPlans(global.UserLoginInfo.phone,true,'删除计划成功')
								},
								fail: (err) => {console.log(err)},})}
				})
			},
					
			/* 完成Picker选择,重置界面数据*/
			FinishPic(e){
				let data=e.detail.__args__[0]
				let SetUseTimes=(type)=>{
					let Hour=TimesList[0][data.value[0]]
					let Minute=TimesList[1][data.value[1]]
					let TimeInfo={
						Hour:Hour,
						Minute:Minute,
						index:data.TimeInfo.index,
						amount:data.TimeInfo.amount,
						remark:data.TimeInfo.remark
					}
					if(type=='添加时间')
						this.UseTimes.push(TimeInfo)
					else
						this.UseTimes[data.TimeInfo.index]=TimeInfo
				}
				switch(data.type){
					case '选择设备':this.EquipmentIndex=data.value; this.CurrentText[0]=data.CurrentText;this.MedicalName="";this.MedicalIndex=[];break
					case '选择日期':this.DateIndex=data.value;this.CurrentText[1]=data.CurrentText;break
					case '选择频率':this.FrequencyIndex=data.value;this.CurrentText[2]=data.CurrentText;break
					case '添加时间':SetUseTimes('添加时间');break
					case '修改时间':SetUseTimes('修改时间');break
				}
				this.Picker=false
			},
			/* 完成弹窗内容,关闭弹窗并返回参数 */
			Close(){
				this.Picker=false
			},
			/* 配置了药柜，设置药柜编号 */
			ChooseMedicines(e){
				this.MedicalIndex=e
				this.SelectMedicine=false
			},
			
			/* 初始化数据方法: */
			SetUseEquipments(){//生成设备信息数组
				/* 如果用户有设备，把设备名组成数组给UseEquipments */
				Equipments=global.EquipmentsInfo
				this.EquipmentInfo=Equipments

				UseEquipments=["不使用设备"]
				if(Equipments.length)
					UseEquipments=UseEquipments.concat(Equipments.map(item=>{
						return item.name
					}))
			},
			SetDateList(){//生成日期数组
				const date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				/* 根据今天日期传给数组对应下标 */
				Today={year:year,month:month,day:day},
				this.Today=year+'年'+month+'月'+day+'日'
				this.DateIndex=[0,Today.month-1,Today.day-1]
				/* 生成日期数组 */
				let YeatList=[],MonthList=[]
				for(let i=year;i<year+10;i++)
					YeatList.push(i)
				for(let i=1;i<13;i++)
					MonthList.push(i)
				for(let i=1;i<32;i++)
					DayList.push(i)
	
				DateList.push(YeatList)
				DateList.push(MonthList)
				DateList.push(DayList)
				
				/* 判断该月有多少天 */
				DayList=[]
				let MaxDay=31
				if(month==4||month==6||month==9||month==11)
					MaxDay=30
				else if(month==2 && year%4==0 && year%100!=0 || year%400==0)
					MaxDay=28
				else if(month==2)
					MaxDay=29
				for(let i=1;i<MaxDay+1;i++)
					DayList.push(i)	
			},//SetDate结束
			SetFrequency(){//生成频率信息数组
				for(let i=1;i<100;i++)
					FrequencyList.push(i)
			},
			SetTimes(){//生成时间数组
				let Hour=[],Minute=[]
				for(let i=0;i<24;i++)
					if(i<10)
						Hour.push("0"+i)
					else
						Hour.push(i)
				for(let i=0;i<60;i++)
					if(i<10)
						Minute.push("0"+i)
					else
						Minute.push(i)
				TimesList.push(Hour)
				TimesList.push(Minute)
			},
			
			/* 修改界面的初始数据 */
			SetChangeData(PlanIndex){
				plan=global.UserPlans[PlanIndex]
				let equipments=global.EquipmentsInfo
				/* 如果使用设备 */
				if(plan.EquipmentID!="不使用设备"){
					equipments.find((item,index)=>{
						if(item.ID==plan.EquipmentID){
							this.EquipmentIndex[0]=index+1
							this.CurrentText[0]=item.name
						}
						return item.ID==plan.EquipmentID
					})
					this.MedicalIndex=JSON.parse(plan.MedicalIndex) 
				}
				else
					this.MedicalName=plan.MedicalName
				/* 修改日期 */
				let date=JSON.parse(plan.date)
				this.CurrentText[1]=date.year+'年'+date.month+'月'+date.day+'日'
				this.DateIndex=[new Date().getFullYear()-date.year,date.month-1,date.day-1]
				/* 修改频率 */
				this.FrequencyIndex[0]=plan.Frequency-1
				if(plan.Frequency>1)
					this.CurrentText[2]='每'+plan.Frequency+'天执行'
				/* 修改时间 */
				this.UseTimes=JSON.parse(plan.UseTimes)
				this.ChangePlan=true
			},
			/* 错误提醒 */
			showtoast(text){
				uni.showToast({
					title:text,
					image:"../../static/error.png",
					duration:1000})
			}
		},//methods结束
	
		components:{
			Picker,SelectMedicine
		}
	}
</script>

<style scoped>
	body{
		font-size: 17px;
	}
	.AddPlan{
		background: #FFFFFF;
		width: 90%;
		border-radius: 10px;
		box-shadow:2px 2px 5px #7b7b7b;
		margin: 20px auto;
	}
	/* 分割线样式 */
	.line{
		width: 85%;
		height: 1px;
		margin: 0 auto;
		position: absolute;
	}
	/* 主体信息 */
	.info:first-child{
		padding-top: 10px;
	}
	.info{
		width: 90%;
		min-height: 40px;
		margin: 0 auto;
		display: flex;
		align-items: center;
	}
	
	/* 配置药柜样式 */
	.Medicines{
		color: #858181;
		font-size: 17px;
		max-width: 65%;
		margin-left: 5px;
		display: flex;
		flex-wrap: wrap;
	}
	.Medicines view{
		margin-right: 5px;
	}
	
	/* 用药时间列表样式 */
	.UseTime{
		background: #fdd930;
		width: 90%;
		border-radius: 5px;
		margin: 5px auto;
		display: flex;
		align-items: center;
	}
	.time{
		background: #fff;
		height: 40px;
		width: 20%;
		border-radius: 5px;
		margin: 7px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.content{
		font-size: 15px;
	}
	
	/* 添加用药时间照片 */
	.AddTime{
		width: 12%;
		margin-left: 5%;
	}
	
	/* 提示内容 */
	.reminder{
		font-size: 15px;
		color:#7b7b7b;
		width: 90%;
		margin: 5px auto;
	}
	/* 确认按键 */
	.sure{
		color: #FFFFFF;
		background: #088573;
		width: 25%;
		line-height: 2.3;
		border-radius: 10px;
	}
	/* 删除按键 */
	.remove{
		color: #FFFFFF;
		background: #f14d4d;
		width: 25%;
		line-height: 2.3;
		border-radius: 10px;
	}
</style>
