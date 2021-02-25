<template>
	<view class="myPeers">
		<!-- 头部豆子总数 -->
		<view class="head">
			<!-- 图片logo -->
			<image src="../../static/pic/fontpage/logo.svg" mode="" class="logo-image"></image>
			<!-- 数量 -->
			<view class="num">
				你共拥有
				<image src="../../static/pic/detail/peers.png" mode="" class="peer"></image>
				<text class="peer-num">{{userInfo.user.bean}}</text>
				颗
				<!-- 豆子机制入口 -->
				<image src="../../static/pic/detail/information-circle-outline.png" mode="" class="info" @click="switchToAbout"></image>
				<text class="peer-detail" @click="switchToPeerDetail">查看豆子明细</text>
			</view>
			<!--文字logo -->
			<image src="../../static/pic/detail/wonderpeers-svg.svg" mode="" class="text-logo"></image>
		</view>
		<!-- 我要赚豆子 -->
		<view class="text-title">
			<view>
			</view>
			<text>我要赚豆子</text>
			<view>
			</view>
		</view>
		<!-- 赚豆子任务 -->
		<view class="task" v-for="(item,i) in task" :key="i">
			<text style="margin-left: 28upx;">{{item.name}}<text v-if="i===4">（已完善{{count}}%）</text> </text>
			<!-- 豆子图标 -->
			<image src="../../static/pic/detail/peers.png" mode="" class="peers"></image>
			+{{item.num}}

			<!-- 引导按钮 -->
			<view class="guide-button" :class="item.isFinish?'finish':''" @click="finishTask(i)">
				{{item.guide}}
				<button open-type="share" v-if="i === 1"></button>
			</view>
		</view>
		<!-- 绑定手机号 -->
		<!-- <view class="task">
			<text style="margin-left: 28upx;">绑定手机号</text>
			<image src="../../static/pic/detail/peers.png" mode="" class="peers"></image>
			+5
			<view class="guide-button">
				去绑定
				<button open-type="getPhoneNumber"></button>
			</view>
		</view> -->
		<!-- 底部联系客服 --> 
		<view class="bottom-button">
			<button open-type="contact">
				<image src="../../static/pic/detail/help-circle-outline.png" mode=""></image>
				豆子问题，联系客服
			</button>
		</view>
	</view>
</template> 
 
<script> 
	export default {
		data() {
			return {
				task: [{
						name: '每日签到',
						num: 1,
						guide: '今日签到',
						isFinish: false
					},
					{
						name: '每成功邀请一个新好友',
						num: 5,
						guide: '去邀请',
						isFinish: false
					},
					{
						name: '发布一个帖子',
						num: 10,
						guide: '去发布',
						isFinish: false
					},
					{
						name: '每完成一个Offer认证',
						num: 20,
						guide: '去认证',
						isFinish: false
					}, {
						name: '完善个人信息',
						num: '10~20',
						guide: '去完善',
						isFinish: false
					}, {
						name: '身份认证',
						num: 10,
						guide: '去认证',
						isFinish: false
					},
				],
				userInfo:{},
				count:0
			}
		},
		methods: {
			// task点击任务
			finishTask: function(i) {
				if(this.task[i].isFinish === true){
					return
				}
				// i=0,触发签到
				if(i === 0) {
					this.signUp()
				}
				// 2为去发布
				if(i === 2){
					uni.switchTab({
						url:'../publish/publish'
					})
				}
				// 3为去offer认证
				if(i === 3){
					// 没有身份认证先身份认证
					if(this.$store.state.userInfoPlatform.user.authentication === -1){
						uni.navigateTo({
							url:'../personalAuthentication/personalAuthentication?offer=true'
						})
					}
					else{
						uni.navigateTo({
							url:'../offerAuthenticationv2/offerAuthenticationv2'
						})
					}
				}
				// 4为去完善
				if(i === 4){
					uni.switchTab({
						url:'../profile/profile'
					})
				}
				// 5为去身份认证
				if(i === 5){
					uni.navigateTo({
						url:'../personalAuthentication/personalAuthentication'
					})
				}
				
			},
			// 签到函数
			signUp:function(){
				let that = this
				// 发起签到请求
				this.$axios.request({
					url:`/user/upDataSignTime`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID
					}
				}).then(function({data}){
					console.log(data)
					if(data.code === 200){
						that.task[0].isFinish = true
						that.task[0].guide = '已签到'
						uni.showToast({
							title:'签到成功！'
						})
					}
					that.$store.commit('updateSignDate',data.data)
					// 增加本地的豆子
					that.$store.commit('updateUserBeanNum',1)
				}).catch(err => {
					console.log(err)
				})
			},
			// 切换至豆子明细页面
			switchToPeerDetail: function() {
				console.log(1)
				uni.navigateTo({
					url: '../peersDetail/peersDetail'
				})
			},
			// 切换至豆子机制页面
			switchToAbout: function() {
				uni.navigateTo({
					url: '../aboutPeers/aboutPeers'
				})
			},
			// 分享函数
			onShareAppMessage(options) {
				// 设置菜单中的转发按钮触发转发事件时的转发内容
				var shareObj = {
					title: "顶尖高校职场同龄人聚集地",
					path: `/pages/fontpage/fontpage?shareOpenId=${this.$store.state.userOpenID}`,
					imageUrl:'../../static/pic/bg/share-pic.jpg'
				}
				return shareObj;
			},
			// 计算完善度%
			countPercent:function(){
				if(this.userInfo.workexperiences.length !==  0){
					this.count += 25
				}
				if(this.userInfo.educationexperiences.length !==  0){
					this.count += 25
				}
				if(this.userInfo.activityexperiences.length !==  0){
					this.count += 25
				}
				if(this.userInfo.Skill.length !==  0){
					this.count += 25
				}
				if(this.count === 100){
					this.task[4].isFinish = true
					this.task[4].guide = '已完善'
				}
			}
		},
		onLoad:function(){
			this.userInfo = this.$store.state.userInfoPlatform
			// 获取当前日期
			let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().substring(0,10)
			// 日期与签到日期相同时则将状态换为已签到
			if(this.$store.state.userInfoPlatform.user.signTime.substring(0,10) === date){
				this.task[0].isFinish = true
				this.task[0].guide = '已签到'
			}
			// 判断身份验证，审核中与已认证
			if(this.$store.state.userInfoPlatform.user.authentication === 0){
				this.task[5].isFinish = true
				this.task[5].guide = '审核中'
			}
			if(this.$store.state.userInfoPlatform.user.authentication === 1){
				this.task[5].isFinish = true
				this.task[5].guide = '已认证'
			}
			// 计算完成度
			this.countPercent()
		}
	}
</script>

<style lang="less" scoped>
	// 头部豆子总数
	.head {
		margin: 36upx;
		height: 254upx;
		background: linear-gradient(287.02deg, #00A29A -11.51%, rgba(218, 241, 240, 0.145833) 77.93%, rgba(255, 255, 255, 0) 100%), #00A29A;
		border-radius: 20upx;
		overflow: hidden;
		position: relative;

		// 数量
		.num {
			color: #FFFFFF;
			font-size: 24upx;
			font-weight: 500;
			margin: 10upx 40upx;
			display: flex;
			align-items: flex-end;
			z-index: 3;

			// 豆子图片
			.peer {
				width: 54upx;
				height: 40upx;
				margin: 0 10upx;
			}

			.peer-num {
				font-size: 100upx;
				font-weight: 600;
				margin-right: 12upx;
				vertical-align: baseline;
				transform: translateY(35upx);
			}

			// 明细图标
			.info {
				width: 30upx;
				height: 30upx;
				z-index: 2;
			}

			// 豆子明细
			.peer-detail {
				font-size: 20upx;
				text-decoration: underline;
				margin-left: auto;
				z-index: 3;
			}
		}

		// 右下水印
		.logo-image {
			width: 600upx;
			height: 332upx;
			mix-blend-mode: lighten;
			position: absolute;
			bottom: -55upx;
			right: -150upx;
		}

		.text-logo {
			position: absolute;
			bottom: 26upx;
			right: 26upx;
			width: 254upx;
			height: 24upx;
		}
	}

	// 我要赚豆子
	.text-title {
		margin: 40upx 36upx;
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			color: #00A29A;
			font-size: 28upx;
			font-weight: 500;
			margin: 0 22upx;
			flex-shrink: 0;
		}

		view {
			width: 100%;
			height: 2upx;
			background-color: #00A29A;
		}
	}

	// 赚豆子任务
	.task {
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
		border-radius: 20upx;
		margin: 16upx 36upx;
		height: 72upx;
		display: flex;
		align-items: center;
		font-size: 24upx;
		overflow: hidden;

		// 豆子
		.peers {
			width: 38upx;
			height: 28upx;
			margin: 0 10upx 0 16upx;
		}

		// 引导按钮
		.guide-button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 140upx;
			background: #F2FAFA;
			box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
			height: 100%;
			font-size: 24upx;
			color: #00A29A;
			margin-left: auto;
			position: relative;
			button{
				background-color: rgba(0,0,0,0);
				width: 140upx;
				height: 72upx;
				position: absolute;
				top: 0;
				&::after{
					border: none;
				}
			}
		}

		// 完成后样式
		.finish {
			background-color: #F2F2F2;
			color: #828282;
		}
	}

	// 底部联系客服
	.bottom-button {
		height: 136upx;
		width: 100%;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		button {
			display: flex;
			align-items: center;
			font-size: 20upx;
			color: #00A29A;
			justify-content: center;
			background-color: #FFFFFF;

			image {
				width: 30upx;
				height: 30upx;
				margin-right: 5upx;
			}

			&::after {
				border: none;
			}
		}
	}
</style>
