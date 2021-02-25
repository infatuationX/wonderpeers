<template>
	<view id="publishSuccess">
		<!-- 发布成功标题 -->
		<view class="success">
			<image src="../../static/pic/detail/success.svg" mode=""></image>
			<text>{{editFlag?'修改成功':'发布成功'}}</text>
			<text v-if="!editFlag">恭喜你获得10颗豆子的奖励</text>
		</view>
		<!-- 豆子 -->
		<view class="peers" v-if="!editFlag">
			<image src="../../static/pic/fontpage/logo-small.png" mode=""></image>
			<text>x 10</text>
		</view>
		<!-- offer认证提示 -->
		<view class="advertisement" v-if="!editFlag">
			<!-- 背景图片 -->
			<image src="../../static/pic/detail/offerbg.png" mode="" class="bgImg"></image>
			<!-- 右边文字以及button -->
			<view class="right-area">
				<text>认证实习/全职 Offer，\n 获得更多豆子与优先推荐！</text>
				<view style="width:104upx;height:50upx;">
					<button @click="switchToAuth">去认证</button>
				</view>
				<!-- 扩大点击区域的btn -->
			</view>
			<button type="default" @click="switchToAuth" class="replace-btn"></button>
		</view>
		<!-- 底部固定按钮 -->
		<view class="bottom">
			<button @click="backToFontpage">回到首页</button>
			<button @click="backToPublish">继续发布</button>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				editFlag:false
			}
		},
		methods: {
			backToFontpage:function() {
				uni.switchTab({
					url:'../fontpage/fontpage'
				})
			},
			backToPublish:function(){
				uni.switchTab({
					url:'../publish/publish'
				})
			},
			// 切换至个人
			switchToAuth:function(){
				if(this.$store.state.userInfoPlatform.user.authentication === -1){
					uni.navigateTo({
						url:'../personalAuthentication/personalAuthentication'
					})
				}
				else{
					uni.navigateTo({
						url:'../offerAuthenticationv2/offerAuthenticationv2'
					})
				}
				
			}
		},
		onLoad:function(options) {
			if(options.type === 'edit'){
				this.editFlag = true
			}
		}
	}
</script>

<style lang="less" scoped>
	.success{
		display: flex;
		align-items: center;
		flex-direction: column;
		image{
			&:nth-child(1){
				margin-top: 200upx;
				width: 160upx;
				height: 160upx;
			}
		
		}
		text{
			&:nth-child(2){
				font-size: 56upx;
				margin-top: 40upx;
			}
			&:nth-child(3){
				font-size: 24upx;
				color: #828282;
				margin-top: 36upx;
			}
		}
	}
	// 豆子
	.peers{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 36upx;
		image{
			width: 60upx;
			height: 40upx;
		}
			
		text{
			font-size: 28upx;
			color: #4F4F4F;
		}
	}
	// offer认证提示
	.advertisement{
		margin: 36upx;
		width: 678upx;
		height: 216upx;
		position: fixed;
		bottom: 180upx;
		display: flex;
		align-items: center;
		// 背景图
		.bgImg{
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 20upx;
			width: 100%;
			height: 216upx;
		}

		// 右边文字
		.right-area{
			display: flex;
			flex-direction: column;
			justify-content: left;
			z-index: 5;
			margin-left: auto;
			margin-right: 20upx;
			text{
				color: #333333;
				font-weight: 500;
				font-size: 24upx;
			}
			button{
				margin-top: 16upx;
				padding: 0;
				background-color: #00A29A;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24upx;
				font-weight: 500;
				border-radius: 10upx;
				width: 104upx;
				height: 50upx;
			}
		}
		.replace-btn{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background-color: rgba(0,0,0,0);
			z-index: 10;
			&::after{
				border: none;
			}
		}
	}
	
	// 底部固定按钮
	.bottom{
		width: 100%;
		height: 160upx;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		button{
			width: 320upx;
			height: 100upx;
			font-size: 36upx;
			border-radius: 20upx;
			&:nth-child(1){
				border:  2px solid #00A29A;
				color: #00A29A;
				background-color: #FFFFFF;
			}
			&:nth-child(2){
				color: #FFFFFF;
				background-color: #00A29A;
				margin-left: 10upx;
			}
		}
	}
</style>
