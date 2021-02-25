<template>
	<view class="identitySuccess">
		<view class="success">
			<image src="../../static/pic/detail/success.svg" mode=""></image>
			<text>审核中…</text>
			<!-- 豆子个数 -->
			<view class="peers" v-if="!editFlag">
				<image src="../../static/pic/fontpage/peer2x.png" mode=""></image> × {{peerNum}} 在路上啦！
			</view>
			
		</view>
		<!-- offer认证卡片 -->
		<view class="offer-card" v-if="offerFlag || editFlag"> 
			<!-- 公司logo -->
			<image :src="`${baseUrl}/file/${comIcon}`" mode="" v-if="comIcon!=='' && comIcon!==null"></image>
			<image src="../../static/pic/me/offerlogo.png" mode="" v-if="comIcon==='' || comIcon===null"></image> 
			<!-- 职位 -->
			<view class="position">
				<text>{{position}}</text> 
				<text>{{comName}}</text> 
			</view>
			<!-- 类型 -->
			<text class="type" :class="offertype==='全职'?'fulltime':''">{{offertype}}</text> 
		</view> 
		<!-- 底部按钮 -->
		<view class="btngroup" v-if="offerFlag">
			<view style="width: 700upx;display: flex;justify-content: space-around;">
				<button @click="switchToProfile">确定</button>
				<button @click="switchToAuth">继续认证</button>
			</view>
		</view>
		
		<view class="btngroup" v-if="!offerFlag">
			<view style="width: 700upx;display: flex;justify-content: space-around;">
				<button @click="switchToFontpage">回到首页</button>
				<button @click="switchBack">确定</button>
			</view> 
		</view> 
	</view> 
</template> 

<script>
	export default{
		data() {
			return {
				offerFlag:false,
				personFlag:false,
				editFlag:false,
				// 公司名
				comName:'',
				comIcon:'',
				offertype:'',
				position:'',
				baseUrl:'',
				peerNum:0
			}
		},
		methods:{
			// 切换至个人页
			switchToProfile:function(){
				uni.switchTab({
					url:'../profile/profile'
				})
			},
			// 回到编辑页
				
			switchToAuth:function(){
				if(this.offerFlag === true){
					uni.reLaunch({
						url:'../offerAuthenticationv2/offerAuthenticationv2'
					})
				}
				if(this.personFlag === true){
					uni.reLaunch({
						url:'../offerAuthenticationv2/offerAuthenticationv2'
					})
				}
			},
			switchBack:function(){
				uni.switchTab({
					url:'../profile/profile'
				})
			},
			switchToFontpage:function(){
				uni.switchTab({
					url:'../fontpage/fontpage'
				})
			}
		},
		onLoad:function(options) {
			// 进入成功页的不同类型
			if(options.type === 'offer'){
				this.offerFlag = true
				this.peerNum = 20
				console.log(options)
				this.comName = options.comName
				this.comIcon = options.comIcon
				this.offertype = options.offertype
				this.position = options.position
			}
			if(options.type === 'person'){
				this.personFlag = true
				this.peerNum = 10
			}
			if(options.type === 'edit'){
				this.editFlag = true
				this.comName = options.comName
				this.comIcon = options.comIcon
				this.offertype = options.offertype
				this.position = options.position
			}
			this.baseUrl = this.$store.state.baseUrl
		}
	}
</script>

<style lang="less" scoped>
	// 认证成功
	.success{
		margin-top: 200upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image{
			width: 163upx;
			height: 163upx;
		}
		text{
			margin-top: 40upx;
			font-size: 56upx;
		}
		.peers{
			margin-top: 22upx;
			display: flex;
			align-items: center;
			image{
				width: 62upx;
				height: 42upx;
			}
		}
	}
	// offer认证卡片
	.offer-card{
		box-sizing: border-box;
		height: 110upx;
		border: 1px solid #E6F6F5;
		margin: 48upx 36upx;
		display: flex;
		align-items: center;
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
		border-radius: 20upx;
		// 公司logo
		image{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin: 0 28upx;
		}
		// 职位
		.position{
			text{
				display: block;
				font-weight: 500;
				&:nth-child(1){
					font-size: 24upx;
					color: #333333;
				}
				&:nth-child(2){
					font-size: 20upx;
					color: #4F4F4F;
				}
			}
		}
		// 类型
		.type{
			flex-shrink: 0;
			margin-left: auto;
			margin-right: 16upx;
			background-color: #F2C94C;
			color: #FFFFFF;
			padding: 2upx 16upx;
			border-radius: 10upx;
			font-size: 20upx;
		}
		.fulltime{
			background-color: #00a29a;
		}
	}
	// 底部按钮
	.btngroup{
		width: 100%;
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 32upx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		button{
			width: 320upx;
			height: 100upx;
			display: flex;
			align-items: center;
			border-radius: 20upx;
			font-size: 36upx;
			justify-content: center;
			&:nth-child(1){
				border: 2px solid #00A29A;
				color: #00A29A;
				background-color: #FFFFFF;
			}
			&:nth-child(2){
				background-color:#00A29A;
				color: #FFFFFF;
			}
		}
	}
</style>
