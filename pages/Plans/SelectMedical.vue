<template>
	<view class="SelectMedicine">
		<view class="mask"></view>
		
		<view class="Popup">
			<checkbox-group class="medical" @change="select">
					<label
						class="item"
						v-for="(item,index) in medical"
						:key="index"
					>
							<checkbox :value="index"/>
							{{item.medical.name}} * {{item.medical.amount}}
					</label>
			</checkbox-group>
			
			<!-- 确认，取消键 -->
			<view class="Btn">
				<view style="color: #cd2d2d;" @click="Close">取消</view>
				<text>|</text>
				<view style="color: #088573;" @click="sure">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				medical : global.UserMedical,
				selected : []
			}
		},
		methods:{
			select(e){
				this.selected = e.detail.value
			},
			sure(){
				let medicalInfo = []
				this.selected.forEach(index => {
					medicalInfo.push(this.medical[index].medical)
				})
				this.$emit('finishSelect',medicalInfo)
			},
			Close(){
				this.$emit('close')
			}
		}
	}
</script>

<style scoped>
	.Popup .medical{
		display: flex;
		flex-direction: column;
	}
	.Popup .medical .item{
		margin: 5px;
	}
	
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
