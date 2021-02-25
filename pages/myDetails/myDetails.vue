<template>
	<view id="mydetail">
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
			<view style="height: 160upx;">

			</view>
			<!-- 底部固定按钮双个 -->
			<view class="tabbutton-double" >
				<view class="btngroup">
					<button @click="switchToIncome">我的收益</button>
					<button @click="switchToPublish">继续发布</button>
				</view>
			</view>
		</view>
		<!-- 解锁列表 -->
		<view v-if="unlockFlag === true && unlockList.length > 0">
			<!-- 顶部权限开关 -->
			<view class="power-switch">
				<view >
					<text>允许他人查看</text>
					<image :src="isUnlockAllowed?'../../static/pic/detail/open.svg':'../../static/pic/detail/close.svg'" mode=""@click="allowOther"></image>
				</view>
			</view>
			<view class="itemlist" v-for="(item,i) in unlockList" :key="i" @click="switchToDetail(item.postId)">
				<image :src="`${baseUrl}/file/${item.postPhoto}`" mode="aspectFill"></image>
				<text>{{item.title}}</text>
				<image src="../../static/pic/fontpage/bg1.svg" class="bgimage" v-if="item.type === 0"></image>
				<image src="../../static/pic/fontpage/bg4.svg" class="bgimage" v-if="item.type === 1"></image>
				<image src="../../static/pic/fontpage/bg3.svg" class="bgimage" v-if="item.type === 2"></image>
				<image src="../../static/pic/fontpage/bg2.svg" class="bgimage" v-if="item.type === 3"></image>
			</view>
			<view style="height: 160upx;">
		
			</view>
			<!-- 底部固定按钮单个 -->
			<view class="tabbutton-signle">
				<button @click="switchToFontpage">解锁更多干货</button>
			</view>
		</view>
		
		<!-- 收藏列表 -->
		<view v-if="collectFlag === true && collectList.length > 0">
		
			<view class="itemlist" v-for="(item,i) in collectList" :key="i" @click="switchToDetail(item.postId,item.issueId)">
				<image :src="`${baseUrl}/file/${item.postPhoto}`" mode="aspectFill"></image>
				<text>{{item.title}}</text>
				<image src="../../static/pic/fontpage/bg1.svg" class="bgimage" v-if="item.type === 0"></image>
				<image src="../../static/pic/fontpage/bg4.svg" class="bgimage" v-if="item.type === 1"></image>
				<image src="../../static/pic/fontpage/bg3.svg" class="bgimage" v-if="item.type === 2"></image>
				<image src="../../static/pic/fontpage/bg2.svg" class="bgimage" v-if="item.type === 3"></image>
			</view>
			<view style="height: 160upx;">
		
			</view>
			<!-- 底部固定按钮单个 -->
			<view class="tabbutton-signle">
				<button @click="switchToFontpage">解锁更多干货</button>
			</view>
		</view>
		
		<!-- 未发布任何 -->
		<view class="not-publish" v-if="publishFlag === true && publishList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>这位小可爱</text>
				<text>你还没有发布过任何东西</text>
			</view>
			<!-- 底部button -->
			<view class="buttom-button">
				<button @click="switchToPublish">这就去发布！</button>
			</view>
		</view>
		
		<!-- 未解锁任何 -->
		<view class="not-publish" v-if="unlockFlag === true && unlockList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>这位小可爱</text>
				<text>你还没有解锁过任何东西</text>
			</view>
			<!-- 底部button -->
			<view class="buttom-button">
				<button @click="switchToFontpage">这就去解锁！</button>
			</view>
		</view>
		
		
		<!-- 未收藏任何 -->
		<view class="not-publish" v-if="collectFlag === true && collectList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>这位小可爱</text>
				<text>你还没有收藏过任何东西</text>
			</view>
			<!-- 底部button -->
			<view class="buttom-button">
				<button @click="switchToFontpage">这就去收藏！</button>
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
				// 我的收藏标识
				collectFlag:false,
				collectList:[],
				type:'',
				// 基地址
				baseUrl:'',
				isUnlockAllowed:false
			}
		},
	   
		methods:{
			// 转至收益页面
			switchToIncome:function(){
				uni.navigateTo({
					url:'../income/income'
				})
			},
			// 跳转至发布
			switchToPublish:function(){
				uni.switchTab({
					url:'../publish/publish'
				})
			},
			// 跳转到主页
			switchToFontpage:function(){
				uni.switchTab({
					url:'../fontpage/fontpage'
				})
			},
			// 跳转至详情
			switchToDetail:function(id,issueId){
				if(this.publishFlag){
					uni.navigateTo({
						url:`../pageDetailPublisher/pageDetailPublisher?id=${id}`
					})
				}
				if(this.unlockFlag){
					uni.navigateTo({
						url:`../pageDetail/pageDetail?id=${id}`
					})
				}
				if(this.collectFlag){
					if(issueId === this.$store.state.userOpenID){
						uni.navigateTo({
							url:`../pageDetailPublisher/pageDetailPublisher?id=${id}`
						})
					}
					else{
						uni.navigateTo({
							url:`../pageDetail/pageDetail?id=${id}`
						})
					}	
				}
			},
			// 获取我的发布
			getMyPublish:function(){
				// store中有则从store取
				if(this.$store.state.publishList !== ''){
					this.publishList = this.$store.state.publishList
				}
				else{
					let that = this
					this.$axios.request({
						url:`/Message/issue`,
						method:'get',
						params:{
							openid:this.$store.state.userOpenID
						}
					}).then(function({data}){
						console.log(data)
						that.publishList = data.data
						that.$store.commit('updatePublishList',data.data)
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 获取我的解锁
			getMyUnlock:function(){
				if(this.$store.state.unlockList !== ''){
					this.unlockList = this.$store.state.unlockList
				}
				else{
					let that = this
					this.$axios.request({
						url:`/Message/unlock`,
						method:'get',
						params:{
							openid:this.$store.state.userOpenID
						}
					}).then(function({data}){
						console.log(data)
						that.unlockList = data.data
						// 请求结果存入全局
						that.$store.commit('updateUnlockList',data.data)
					}).catch(err => {
						console.log(err)
					})
				}
				
			},
			// 获取我的收藏
			getMyCollect:function(){
				if(this.$store.state.collectList !== ''){
					console.log('进入了缓存的收藏')
					this.collectList = this.$store.state.collectList
				}
				else{
					console.log('进入了请求的收藏')
					let that = this
					this.$axios.request({
						url:`/Message/collection`,
						method:'get',
						params:{
							openid:this.$store.state.userOpenID
						}
					}).then(function({data}){
						console.log(data)
						that.collectList = data.data
						that.$store.commit('updateCollectList',data.data)
					}).catch(err => {
						console.log(err)
					})
				}
				
			},
			// 是否允许他人查看
			allowOther:function(){
				let that = this 
				let isAllow = 1
				// 检测当前为关闭状态时，赋值0打开
				if(this.isUnlockAllowed === false){
					isAllow = 0
				}
				this.$axios.request({
					url:`/user/UpdateIslock`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID,
						ISLockC:isAllow,
						IsLockF:this.$store.state.userInfoPlatform.user.isLockFollow
					}
				}).then(function({data}){
					console.log(data)
					that.isUnlockAllowed = !that.isUnlockAllowed
					let tmpData = {
						isLockCollection:isAllow,
						isLockFollow:that.$store.state.userInfoPlatform.user.isLockFollow
					}
					that.$store.commit('updateUserAuthorization',tmpData)
					uni.showToast({
						title:'修改成功!' 
					})
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
					title: '我的发布'
				}) 
			}
			if (options.type === '3') {
				this.unlockFlag = true
				uni.setNavigationBarTitle({
					title: '我的解锁'
				})
			}
			if (options.type === '4') {
				this.collectFlag = true
				uni.setNavigationBarTitle({
					title: '我的收藏'
				})
			}
			// 权限开关控制
			if(this.$store.state.userInfoPlatform.user.isLockCollection === 0){
				this.isUnlockAllowed = true
			}
			else{
				this.isUnlockAllowed = false
			}
			// 获取请求基地址
			this.baseUrl = this.$store.state.baseUrl
		},
		onShow:function(){
			if(this.unlockFlag){
				this.getMyUnlock()
			}
			if(this.collectFlag){
				this.getMyCollect()
			}
			if(this.publishFlag){
				this.getMyPublish()
			}
		}
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
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
