<template>
	<view class="Record">
		<view 
			class="record"
			v-for="(record,index0) in records"
			:key="index0"
		>
			<view class="'head">
				<text space="emsp">
					{{record[0].date === today ? '今天' : record[0].date}}
				</text>
			</view>
			<view 
				class="content"
				v-for="(item,index1) in record"
				:key="index1"
			>
				<!-- 状态图标 -->
				<view class="condition">
					<image v-if="item.condition === 2" src="../../static/record/finish.png" mode="widthFix"></image>
					<image v-else-if="item.condition === 0" src="../../static/record/unfinish.png" mode="widthFix"></image>
					<image v-else-if="item.condition === 1" src="../../static/record/timeout.png" mode="widthFix"></image>
				</view>
				
				<!-- 用药时间 -->
				<view class="time">
					{{item.time}}
				</view>
				
				<!-- 用药列表 -->
				<view class="medicines">
					<view
						v-for="(medical,index2) in item.medicines"
						:key="index2"
					>
						<text class="name">{{medical.name}}</text>
						<text class="amount">*{{medical.amount}}</text>
					</view>
				</view>
				
				<!-- 处理方式 -->
				<view class="dispose">
					<view class="timeout" v-if="item.condition === 1">
						超时{{item.timeout}}分钟
					</view>
					<view 
						class="readed" 
						v-if="item.condition === 0 && item.readed != 1"
						@click="readed(item.ID,index0,index1)"
					>
						标为已读
					</view>
					<view v-if="item.condition === 0 && item.readed === 1">已读</view>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	/*
		数据类型：date:字符串（日期） time:字符串(时间) conditione:数字(状态,0未完成，1超时，2完成) timeout:数字（超时时间，默认为0）
		readed:数字(是否已读，0代表未读,1代表已读) medicines:字符串（存放一个json格式数组，药物信息） 
		ID:唯一标识码（记录唯一标识码） phone:手机号（用户唯一标识码）
	*/
	export default{
		data(){
			const date = new Date()
			const today = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
			return{
				today : today,
				page : 1,
				records : []//condition: 0未完成，1超时，2完成
			}
		},
		onLoad(e) {
			this.GetRecords(global.UserLoginInfo.phone)
		},
		methods:{
			readed(ID,index0,index1){
				uni.showLoading({title:'等待片刻...'})
				uni.request({
					url:'https://jinlongyuchitang.cn:4000/Record/readed',
					method:"POST",
					data:{
						ID : ID
					},
					success: (res) => {
						this.records[index0][index1].readed = 1
					},
					complete() {uni.hideLoading()}
				})
			},
			GetRecords(phone){//获取记录
				uni.showLoading({title:'读取中...'})
				uni.request({
					url:'https://jinlongyuchitang.cn:4000/Record/GetRecords',
					method:"POST",
					data:{
						phone : phone
					},
					success: (res) => {
						this.records = res.data
					},
					complete() {uni.hideLoading()}
				})
			},
		}
	}
</script>

<style>
	body{
		background: rgba(225,225,225,0.8);
		font-size: 17px;
	}
	.record{
		width: 94%;
		background: #F4F4F4;
		box-shadow: 2px 2px 2px #b1b1b1;
		border-radius: 5px;
		margin: 10px auto;	
	}	
	.head{
		height: 35px;
		width: 94%;
		margin: 0 auto;
		border-bottom: 1px solid rgba(210,210,210,0.9);
		position: relative;
	}
	.head text{
		color: #8d8d8d;
		position: absolute;
		right: 0;
		top: 10px;
	}
	
	.content{
		color: #4d4d4d;
		width: 94%;
		min-height: 30px;
		border-bottom: 1px solid rgba(210,210,210,0.5);
		margin: 0 auto;
		padding: 5px 0;
		display: flex;
		align-items: center;
	}
	
	.content .condition{
		margin-left: 5px;
	}
	.content .condition image{
		width: 20px;
	}
	
	.content .time{
		margin-left: 10px;
		margin-top: -5px;
	}
	
	.content .medicines{
		margin-left: 15px;
		line-height: 1.5;
		flex: 1 0 auto;
	}
	.content .medicines .amount{
		margin-left: 3px;
	}
	
	.content .dispose{
		text-align: center;
		font-size: 15px;
	}
	.content .dispose .readed{
		color: #d72525;
		animation: rotate 2s infinite linear;
	}
	.content .dispose .readed:active{
		font-weight: 600;
	}
	@keyframes rotate{
		0%{-webkit-transform:scale(1) rotate(0);}
		10%{-webkit-transform:scale(0.9)}
		30%,50%,70%,90%{-webkit-transform:scale(1.1) rotate(5deg);}
		40%,60%,80%{-webkit-transform:scale(1.1) rotate(-5deg);}
		100%{-webkit-transform:scale(1) rotate(0);}
	}
</style>
