<!-- 弹窗选择 -->
<template>
	<view class="Picker">
		<view class="mask"></view>
		
		<view class="Popup">
			<!-- 选中的提示文字 -->
			<view class="CurrentText">
				{{CurrentText=='' ? InitialText:CurrentText}}
			</view>
			
			<picker-view :value="value" @change="PickerChange">
				<picker-view-column>
					<view v-for="(item,index) in Items1" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="Items2.length">
					<view v-for="(item,index) in Items2" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="Items3.length">
					<view v-for="(item,index) in DayList.length>0? DayList:Items3" :key="index">
						{{item}}
					</view>
				</picker-view-column>
			</picker-view>
						
			<!-- 不需要设备时设置用药时间特有输入框 -->
			<view class="UseTime" v-if="(type=='添加时间' || type=='修改时间') && EquipmentIndex[0] === 0">
				<view class="info">
					<view>用药量：</view>
					<input type="number" v-model="TimeInfo.amount" placeholder="服用药物数量"/>
				</view>
				<image class="line" src="../../static/Plans/line.png"/>
				
				<h2>备注:</h2>
				<textarea placeholder="可以备注些注意事项噢"
					v-model="TimeInfo.remark"/>
			</view>
			
			<view class="record" v-else-if="(type=='添加时间' || type=='修改时间') && EquipmentIndex[0] != 0">			
				<view class="remark">按住录音作为计划执行的提示音</view>
				<view class="box"  @touchstart="StartRecord" @touchend="StopRecord"  @click="listen">
					<image :hidden="RecordUrl" class="start_play" src="../../static/Plans/StartRecord.png"
						mode="widthFix"/>
					<image :hidden="!RecordUrl" class="start_play" src="../../static/Plans/PlayVoice.png" 
						mode="widthFix"/>
					<!-- 动画效果 -->
					<view :class="animationStatus ? 'rippleAnimation1 ripple' : 'ripple'"></view>
					<view :class="animationStatus ? 'rippleAnimation2 ripple' : ''"></view>
					<view :class="animationStatus ? 'rippleAnimation3 ripple' : ''"></view>
				</view>
				
				<image class="delete" src="../../static/Plans/delete.png" mode="widthFix"
					@click="RemoveUrl"/>
			</view>
			
			<!-- 确认，取消键 -->
			<view class="Btn">
				<view style="color: #cd2d2d;" @click="Close">取消</view>
				<text>|</text>
				<view style="color: #088573;" @click="FinishPic">确认</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	var CurrentText
	var recorderManager = uni.getRecorderManager()
	var innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.volume = 1
	
	export default{
		data(){
			return{
				CurrentText : '',
				DayList : [],
				animationStatus: false
			}
		},
		methods:{
			PickerChange(e){
				let value=e.detail.value
				if(this.type=='选择设备')
					CurrentText=this.Items1[value[0]]
					
				else if(this.type=='选择日期'){
					let year=this.Items1[value[0]]
					let month=this.Items2[value[1]]
					
					if(value[0]!=this.value[0] || value[1]!=this.value[1])
						this.SetDayList(year,month)
					
					let day=this.Items3[value[2]]
					CurrentText=
						year+'年'+month+'月'+day+'日'
				}	
				
				else if(this.type=="选择频率"){
					if(this.Items1[value[0]]==1)
						CurrentText="每天执行"
					else
						CurrentText="每"+this.Items1[value[0]]+"天执行"
				}
				
				else{
					CurrentText=this.Items1[value[0]]+":"+this.Items2[value[1]]
				}
				
				this.value=e.detail.value
				this.CurrentText=CurrentText
			},
			/* 重新更新每个月的天数 */
			SetDayList(year,month){
				let MaxDay=this.Items3.length
				let DayList=[]
				if(month==4||month==6||month==9||month==11)
					MaxDay=30
				else if(month==2 && year%4==0 && year%100!=0 || year%400==0)
					MaxDay=28
				else if(month==2)
					MaxDay=29
				else
					MaxDay=31
				for(let i=1;i<MaxDay+1;i++)
					DayList.push(i)
					
				this.Items3=DayList
				this.DayList=DayList
			},
			
			/* 录音 */
			StartRecord(){
				if(!this.TimeInfo.RecordUrl){
					this.animationStatus = true
					recorderManager.start({
						format : 'mp3'
					})
				}
			},
			StopRecord(){
				if(!this.TimeInfo.RecordUrl){
					this.animationStatus = false
					recorderManager.stop()
					recorderManager.onStop(res => {
						if(res.duration > 500)
							this.TimeInfo.RecordUrl = res.tempFilePath
					})
				}
			},
			listen(){
				if(this.TimeInfo.RecordUrl){
					console.log('播放录音')
					innerAudioContext.src = this.TimeInfo.RecordUrl
					innerAudioContext.play()
				}
			},
			RemoveUrl(){
				this.TimeInfo.RecordUrl = ''
			},
			
			FinishPic(){//完成选择
				if(this.type === "添加时间" && this.TimeInfo.amount === '' && this.EquipmentIndex[0] === 0)
					this.showtoast("请输入用药量")
				else if(this.type === "修改时间" && this.TimeInfo.amount === '' && this.EquipmentIndex[0] === 0)
					this.showtoast("请输入用药量")
				else{
					let data={
						type:this.type,
						TimeInfo:this.TimeInfo,
						value:this.value,
						CurrentText:this.CurrentText === '' ? this.InitialText : this.CurrentText
					}
					this.CurrentText=''
					this.$emit('FinishPic',data)
				}
			},
			Close(){//取消关闭弹窗
				this.CurrentText=''
				this.$emit('Close',false)
			},
			
			/* 错误提醒 */
			showtoast(text){
				uni.showToast({
					title:text,
					image:"../../static/error.png",
					duration:1000})
			}
		},//methods结束
		computed:{
			RecordUrl(){
				if(this.TimeInfo.RecordUrl === '')
					return false
				else
					return true
			}
		},
		props:{
			type:String,
			EquipmentIndex:Array,
			InitialText:{
				type:String,
				value:''
			},
			TimeInfo:Object,
			value:Array,
			Items1:{
				type:Array,
				value:[]
			},
			Items2:{
				type:Array,
				value:[]
			},
			Items3:{
				type:Array,
				value:[]
			},
		}
	}
</script>

<style scoped>
	.Popup{
		width: 95%;
		left: 2.5%;
	}
	/* 选中的文字提醒 */
	.CurrentText{
		font-size: 18px;
		margin: 10px 10%;
	}
	
	picker-view{
		text-align: center;
		width: 90%; 
		height: 130px;
		margin: 10px auto;
	}
	
	/* 分割线样式 */
	.line{
		width: 90%;
		height: 1px;
		position: absolute;
	}
	
	/* 时间设置特有内容样式 */
	.UseTime{
		font-size: 17px;
		width: 90%;
		margin: 20px auto;
	}
	.UseTime .info{
		height: 40px;
		display: flex;
		align-items: center;
	}
	.UseTime .info input{
		flex: 1;
	}
	.UseTime h2{
		line-height: 1.8;
	}
	.UseTime textarea{
		color: #696767;
		width: 94%;
		height: 60px;
		padding: 5px;
		border: 1px solid #088573;
		border-radius: 10px;
	}
	/* 时间设置特有内容样式 */
	
	/* 录音样式 */
	.record{
		margin: 10px 0;
	}
	.record .remark{
		color: #b3b3b3;
		font-size: 12px;
		text-align: center;
		margin-bottom: 5px;
	}
	.record .box{
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: inline-block;
		position: relative;
		margin-left: 40%;
	}
	.record .start_play{
		width: 50px;
		margin-left: 5px;
		margin-top: 5px;
		z-index: 2;
	}
	/* 动画 */
	.record .ripple{
		position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		border-radius: 50%;
		border:2px solid #088573;
		z-index: 1;
	}
	.rippleAnimation1{
	  animation: ripple 1.5s infinite linear;
	} 
	.rippleAnimation2{
	  animation: ripple 1.5s infinite linear;
	  animation-delay:0.5s;
	} 
	.rippleAnimation3{
	  animation: ripple 1.5s infinite linear;
	  animation-delay:1s;
	} 
	@keyframes ripple{
	  from{
	    opacity: 1;
	    transform: scale(1,1)
	  }
	  to{
	    opacity: 0;
	    transform: scale(3,3)
	  }
	}
	.record .delete{
		width: 25px;
		height: auto;
		margin-left: 30px;
		margin-bottom: 15px;
		z-index: 2;
	}
	/* 录音样式 */
	
	.Btn{
		margin: 10px 0;
		display: flex;
	}
	.Btn view{
		width: 50%;
		text-align: center;
	}
	.Btn text{
		color: rgba(174,174,174,0.6);
	}
</style>
