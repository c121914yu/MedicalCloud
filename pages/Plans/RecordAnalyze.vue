<template>
	<view class="analyze">		
		<text>
			异常记录 <text style="color: #088573;">{{unusual}}</text>
		</text>
		<div class="detail" @click="analyze=true">查看用药分析</div>
		
		<div class="mask" v-if="analyze"></div>
		<div class="Popup" v-if="analyze">
			<div class="info">
				<div class="header">易未完成时间统计</div>
				<div class="distribution">
					<div 
						class="item"
						v-for="(item,index) in unfinishTimes"
						:key="index"
					>
						{{item.time}}-<text>{{item.amount}}</text> 
					</div>
				</div>
			</div>
			
			<div class="info">
				<div class="header">易未完成药物统计</div>
				<div class="distribution">
					<div 
						class="item"
						v-for="(item,index) in unfinishMedicines"
						:key="index"
					>
						{{item.name}}-<text>{{item.amount}}</text> 
					</div>
				</div>
			</div>
			
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				analyze : true,
				unfinishTimes : [
					{time:'07:55',amount:5},
					{time:'17:55',amount:5},
					{time:'03:55',amount:1},
					{time:'14:55',amount:5},
					{time:'07:55',amount:2},
					{time:'05:55',amount:5},
					{time:'09:55',amount:3},
					{time:'12:55',amount:5}
				],
				unfinishMedicines : [
					{name:'阿斯顿发',amount:5},
					{name:'小柴胡颗粒',amount:5},
					{name:'覆盖萨法萨法噶',amount:1},
					{name:'杀我发撒',amount:5},
					{name:'分公司当',amount:2},
					{name:'过去嗯我',amount:5},
					{name:'发',amount:3},
					{name:'色噶',amount:5}
				]
			}
		},
		methods:{
			
		},
		computed:{
			unusual(){
				let unusualSum = 0
				this.records.forEach(item => {
					item.forEach(record => {
						if(record.status === 0 || record.status === 1)
							unusualSum++
					})
				})
				return unusualSum
			}
		},
		props:{
			records : Array
		}
	}
</script>

<style>
	.analyze{
		background: #F4F4F4;
		box-shadow: 2px 2px 2px #b1b1b1;
		border-radius: 5px;
		width: 94%;
		margin: 5px auto 0 auto;
		padding: 5px 0;
		display: flex;
		align-items: center;
	}
	
	.analyze text{
		margin-left: 5px;
		flex: 1;
	}
	
	.analyze .detail{
		color: #088573;
		font-size: 15px;
		margin-right: 10px;
	}
	
	.Popup .info{
		margin: 5px;
		border-bottom: 1px solid #c4c4c4;
	}
	.Popup .info .header{
		text-align: center;
		border-bottom: 1px solid #c4c4c4;
	}
	.Popup .info .distribution{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		line-height: 1.5;
	}
	.Popup .info .distribution text{
		color: #088573;
	}
</style>
