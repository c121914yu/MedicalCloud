<!-- 推送文章组件 -->
<template>
	<view class="PushArticle">
		<swiper class="swiper" :style="SwiperHeight" autoplay="true"
			duration="800"	circular="true">
			<swiper-item v-for="(article,index) in articles" 
				:key="index" @click="NavArticle(article.id)">
				<!-- 这里插入最大 4/3的图片 -->
				<image class="article" :src="article.src" mode="widthFix"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		name:'PushArticle',
		props:['UserLoginInfo'],
		data(){
			return{ 
				SwiperHeight:'max-height:'+global.ScreenWidth*3/4+'px;',
				articles:[
					{name:'11',id:'1',src:'../../static/Artical.jpg'},
					{name:'22',id:'2',src:'../../static/Artical.jpg'},
					{name:'33',id:'3',src:'../../static/Artical.jpg'},
					{name:'44',id:'4',src:'../../static/Artical.jpg'}
				],
			}
		},//data结束
		methods:{
			NavArticle(ID){
				uni.navigateTo({
					url: 'Articles/ArticleDetail?ID='+ID
				});
			}
		}//methods结束
	}
</script>

<style>
	.swiper{
		width: 90%;
		margin: 10px auto;
		border: none;
	}
	.article{
		width: 100%;
		height: 100%;
		border-radius: 20px;
	}
</style>
