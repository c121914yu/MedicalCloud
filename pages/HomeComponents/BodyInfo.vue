<template>
	<view class="BodyInfo">
		<view class="Header">
			<h3>身体指数</h3>
			<navigator hover-class="none" url="BodyInfos/BodyInfos">查看更多</navigator>
		</view>
		
		<image src="../../static/BodyInfo.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	.BodyInfo{
		width: 90%;
		margin: 0 auto;
	}
	.Header{
		line-height: 1.8;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.Header navigator{
		font-size: 14px;
		color: rgba(107,109,110,0.8);
		margin-right: 5px;
	}
	.Header h3{
		color: #58595a;
	}
</style>
