<template>
	<view id="otherDetail">
		<!-- 发布列表 -->
		<view v-if="publishFlag === true && publishList.length > 0">
			<view class="itemlist" v-for="(item,i) in publishList" :key="i" @click="switchToDetail(item.interviewexperienceId)">
				<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
				<text>{{item.title}}</text>
				<image src="../../static/pic/fontpage/bg1.svg" class="bgimage" v-if="item.type === 0"></image>
				<image src="../../static/pic/fontpage/bg4.svg" class="bgimage" v-if="item.type === 1"></image>
				<image src="../../static/pic/fontpage/bg3.svg" class="bgimage" v-if="item.type === 2"></image>
				<image src="../../static/pic/fontpage/bg2.svg" class="bgimage" v-if="item.type === 3"></image>
			</view>
			<view style="height: 160upx;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);">
			</view>
		</view>
		<!-- 解锁列表 -->
		<view v-if="unlockFlag === true && unlockList.length > 0">
			<view class="itemlist" v-for="(item,i) in unlockList" :key="i" @click="switchToDetail(item.postId)">
				<image :src="`${baseUrl}/file/${item.postPhoto}`" mode="aspectFill"></image>
				<text>{{item.title}}</text>
				<image src="../../static/pic/fontpage/bg1.svg" class="bgimage" v-if="item.type === 0"></image>
				<image src="../../static/pic/fontpage/bg4.svg" class="bgimage" v-if="item.type === 1"></image>
				<image src="../../static/pic/fontpage/bg3.svg" class="bgimage" v-if="item.type === 2"></image>
				<image src="../../static/pic/fontpage/bg2.svg" class="bgimage" v-if="item.type === 3"></image>
			</view>
			<view style="height: 160upx;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);">
		
			</view>
		</view>

		
		<!-- 未发布任何 -->
		<view class="not-publish" v-if="publishFlag === true && publishList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>ta还没有发布过任何东西</text>
			</view>
		</view>
		
		<!-- 未解锁任何 -->
		<view class="not-publish" v-if="unlockFlag === true && unlockList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>ta还没有解锁过任何东西</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 我的发布标识
				publishFlag:false,
				publishList:[],
				// 我的解锁标识
				unlockFlag:false,
				unlockList:[],
				type:'',
				// 基地址
				baseUrl:'',
				isUnlockAllowed:false,
			}
		},
	   
		methods:{
			// 跳转至详情
			switchToDetail:function(id){
				if(this.publishFlag){
					uni.navigateTo({
						url:`../pageDetail/pageDetail?id=${id}`
					})
				}
				if(this.unlockFlag){
					uni.navigateTo({
						url:`../pageDetail/pageDetail?id=${id}`
					})
				}
			},
			// 获取ta的发布
			getOtherPublish:function(openId){
				let that = this
				this.$axios.request({
					url:`/Message/issue`,
					method:'get',
					params:{
						openid:openId
					}
				}).then(function({data}){
					console.log(data)
					that.publishList = data.data
				}).catch(err => {
					console.log(err)
				})
			},
	
			// 获取ta的收藏
			getOtherUnlock:function(openId){
				let that = this
				this.$axios.request({
					url:`/Message/unlock`,
					method:'get',
					params:{
						openid:openId
					}
				}).then(function({data}){
					console.log(data)
					that.unlockList = data.data
				}).catch(err => {
					console.log(err)
				})
			}
		},
		
		onLoad: function (options) {
			console.log(options)
			console.log(options.type)
			this.type = options.type
			if (options.type === '1') {
				this.publishFlag = true
				uni.setNavigationBarTitle({
					title: 'ta的发布'
				}) 
				this.getOtherPublish(options.openId)
			}
			if (options.type === '2') {
				this.unlockFlag = true
				uni.setNavigationBarTitle({
					title: 'ta的解锁'
				})
				this.getOtherUnlock(options.openId)
			}
			this.baseUrl = this.$store.state.baseUrl
		},
	}
</script>

<style lang="less" scoped>
	.itemlist {
		height: 120upx;
		margin: 20upx 36upx;
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
		border-radius: 10px;
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;

		image {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			margin-left: 30upx;
			flex-shrink: 0;
		}

		text {
			margin:0 20upx;
			font-size: 24upx;
		}

		.bgimage {
			width: 102upx;
			height: 116upx;
			border-radius: 0;
			opacity: 0.1;
			position: absolute;
			right: -10upx;
			top: 20upx;
		}
	}

	// 底部按钮单一样式
	.tabbutton-signle {
		position: fixed;
		height: 160upx;
		width: 100%;
		bottom: 0;
		border-radius: 20upx 20upx 0 0;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;

		button {
			width: 500upx;
			height: 100upx;
			background-color: #00A29A;
			color: #FFFFFF;
			border-radius: 20upx;
			font-size: 36upx;
		}
	}

	.tabbutton-double {
		position: fixed;
		height: 160upx;
		width: 100%;
		bottom: 0;
		border-radius: 20upx 20upx 0 0;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;

		.btngroup {
			width: 100%;
			margin: 0 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		button {
			width: 320upx;
			height: 100upx;
			border-radius: 20upx;
			font-size: 36upx;

			&:nth-child(1) {
				background-color: #FFFFFF;
				color: #00A29A;
				border: 2px solid #00A29A;
			}

			&:nth-child(2) {
				background-color: #00A29A;
				color: #FFFFFF;
			}

		}
	}
	// 没有发布或收藏时的样式
	.not-publish{
		// 豆子logo及文字
		.main-logo{
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-top: 300upx;
			image{
				width: 280upx;
				height: 223upx;
				margin-bottom: 32upx;
			}
			text{
				letter-spacing: -0.3px;
				font-size: 28upx;
				color: #BDBDBD;
			}
		}
		// 底部的button
		.buttom-button{
			width: 100%;
			position: fixed;
			display: flex;
			justify-content: center;
			bottom: 30upx;
			button{
				height: 100upx;
				width: 500upx;
				background-color: #00A29A;
				color: #FFFFFF;
				font-size: 36upx;
				border-radius: 20upx;
				border: 1px solid #00A29A;
				&::after{
					border: none;
				}
			}
		}
	}
	// 顶部权限按钮
	.power-switch{
		display: flex;
		margin-right: 36upx;
		view{
			margin-left: auto;
			display: flex;
			align-items: center;
			text{
				color: #828282;
				font-size: 24upx;
			}
			image{
				margin-left: 12upx;
				width: 56upx;
				height: 32upx;
			}
		}
		
	}
</style>
