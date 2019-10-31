<template>
	<view class="New">
		<!-- 扫一扫自动填写信息 -->
		<image class="scan" @click="scan"
			src="../../static/scan.png" mode="widthFix"></image>
			
		<!-- 设备内容:类型,标识码,名称,备注 -->
		<h2>扫一扫自动添加信息</h2>
		<EquipmentInfo :info="ChildrenInfo"></EquipmentInfo>
		
	</view>
</template>

<script>
	import EquipmentInfo from './EquipmentInfo'
	export default{
		data(){
			return{
				ChildrenInfo:{
					BtnText:'添加设备',
					LoadingText:'添加设备中',
					PostSrc:'https://jinlongyuchitang.cn:4000/AddEquipment',
					SuccessText:'添加设备成功',
					change:false,
					EquipmentInfo:{}
				}
			}
		},
		methods:{
			scan(){//扫一扫自动添加设备
				uni.scanCode({
					/* 后台给设备生成字符集，然后被result获取 */
					success: function (res) {
						console.log('扫码成功')
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				})
			}	
		},//methods结束
		components:{
			EquipmentInfo
		}
	}
</script>

<style>
	h2{
		text-align: center;
		margin-bottom: 10px;
	}
	.scan{
		/* 扫一扫样式 */
		width: 20%;
		height: auto;
		margin: 10px 40%;
	}
</style>
