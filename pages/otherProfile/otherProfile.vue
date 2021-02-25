<template>
	<view id="otherprofile">
		<view style="background-color: #FFFFFF;position: fixed;width: 100%;">
			<!-- 头部背景及头像定位 -->
			<view class="head">
				<view class="profile-head">
					<image src="../../static/pic/fontpage/logo.svg" mode=""></image>
					<image src="../../static/pic/me/back.svg" mode="" class="backIcon" @click="backToPrevious" id="backIcon" :style="{top:backIconPos+'px'}"></image>
				</view>
				<image :src="`${baseUrl}/file/${userInfo.user.userPot}`" mode="aspectFill" class="avatar" v-if="userInfo.user.userPot"></image>
				<view class="dav" v-if="userInfo.user.vIdentity === 1">
					<image src="../../static/pic/fontpage/dav.svg" mode=""></image>
					<text>豌豆派优质内容生产者</text>
				</view>
				
			</view>
			<!-- 用户名及标签 -->
			<view class="nickname">
				<view class="upArea">
					<text>{{userInfo.user.userName}}</text>
				</view>
				<view class="downArea">
					<text class="fulltime" v-for="(item,i) in userInfo.OfferAuthentication.fullTime" :key = "i">{{item}}</text>
					<text v-for="(item,i) in userInfo.OfferAuthentication.internship" :key = "i">{{item}}</text>
				</view>
			</view>
			<!-- 用户的数据 -->
			<view class="userdata">
				<view @click="switchToOtherDetail(1)"> 
					<text>{{userInfo.user.issueNum}}</text>
					<text>Ta的发布</text>
				</view>
				<view @click="switchToOtherDetail(2)">
					<text>{{userInfo.user.followNum}}</text>
					<text>Ta的关注</text>
				</view>
				<view @click="switchToOtherDetail(3)">
					<text>{{userInfo.user.unlockNum}}</text>
					<text>Ta的解锁</text>
				</view>
				<!-- 关注 -->
				<view @click="followBtnClick">
					<image :src="isfollow?'../../static/pic/detail/following.svg':'../../static/pic/detail/follow.svg'" mode=""></image>
				</view>
			</view>
		</view>
		<view style="height: 560upx;">

		</view>
		<!-- 个人页四个选项 -->

		<!-- offer认证 -->
		<view>
			<view class="identify">
				<image src="../../static/pic/me/me-logo1.svg" mode=""></image>
				<text>offer认证</text>
			</view>
			<!-- offer认证具体 -->
			<view class="offer" v-for="(item,i) in userInfo.workexperiences" :key="i">
				<!-- logo -->
				<image :src="`${baseUrl}/file/${item.logo}`" mode="" v-if="item.logo!=='' && item.logo!==null"></image>
				<image src="../../static/pic/me/offerlogo.png" mode="" v-if="item.logo==='' || item.logo===null"></image>
				<!-- 职位及公司名 -->
				<view class="position">
					<text>{{item.position}}</text>
					<text>{{item.companyName}}</text>
				</view>
				<!-- 状态 -->
				<view class="status">
					<text class="internship" v-if="item.workType==='实习'">实习</text>
					<text class="fulltime" v-if="item.workType==='全职'">全职</text>
				</view>
			</view>
		</view>

		<!-- 教育经历 -->
		<view>
			<view class="identify">
				<image src="../../static/pic/me/me-logo2.svg" mode=""></image>
				<text>教育经历</text>
			</view>
			<!-- 教育经历详情 -->
			<view class="edu" v-for="(item,i) in userInfo.educationexperiences" :key="i">
				<image :src="`${baseUrl}/file/${item.schoolPhoto}`" mode="" v-if="item.schoolPhoto !== ''&& item.schoolPhoto!==null"></image>
				<image src="../../static/pic/me/edulogo.png" mode="" v-if="item.schoolPhoto === '' || item.schoolPhoto===null"></image>
				<!-- 学位及大学名 -->
				<view class="position">
					<text>{{item.school}}</text>
					<text>{{item.education}}-{{item.major}}</text>
				</view>
				<!-- 状态 -->
				<view class="status">
					<text>{{item.startTime}}-{{item.endTime}}</text>

				</view>
			</view>
		</view>

		<!-- 活动经历 -->
		<view>
			<view class="identify">
				<image src="../../static/pic/me/me-logo3.svg" mode=""></image>
				<text>活动经历</text>
			</view>
			<!-- 活动经历详情 -->
			<view class="edu" v-for="(item,i) in userInfo.activityexperiences" :key="i">
				<image :src="`${baseUrl}/file/${item.organizationPhoto}`" mode="" v-if="item.organizationPhoto!=='' && item.organizationPhoto!==null"></image>
				<image src="../../static/pic/me/activitylogo.png" mode="" v-if="item.organizationPhoto==='' || item.organizationPhoto===null"></image>
				<!-- 学位及大学名 -->
				<view class="position">
					<text>{{item.organization}}</text>
					<text>{{item.position}}</text>
				</view>
				<!-- 状态 -->
				<view class="status">
					<text>{{item.startTime}}-{{item.endTime}}</text>
				</view>
			</view>
		</view>
		<view>
			<!-- 个人技能 -->
			<view class="identify">
				<image src="../../static/pic/me/me-logo4.svg" mode=""></image>
				<text>个人技能</text>
			</view>
			<!-- 个人技能标签 -->
			<view class="skill">
				<text v-for="(item,i) in userInfo.Skill" :key="i" v-if="userInfo.Skill[i] !== ''">{{item}}</text>
			</view>
		</view>

		<view style="padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);height: 100upx;">

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				offer: [],
				// 返回图标位置信息
				backIconPos: 0,
				iconHeight: 0,
				isfollow: false,
				followSrc: '../../static/pic/detail/follow.svg',
				// 用户信息
				userInfo: {},
				baseUrl: '',
				// offer,
				offerlist:'',
				// 实习offer
				internship:[],
				// 全职offer
				fulltime:[],
				// 用户的个人关注列表，用于比对
				selfFollowList:[]
			}
		},

		methods: {
			// 回到前一页
			backToPrevious: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 关注某人函数
			followBtnClick: function() {
				if (this.isfollow === false) {
					this.followOther()
				} else {
					this.unfollowOther()
				}
			},
			// 关注该用户
			followOther: function() {
				// 判断如果是自己不能关注
				if(this.userInfo.user.openId === this.$store.state.userOpenID){
					uni.showToast({
						title:'不能关注你自己哦',
						icon:'none'
					})
					return
				}
				let that = this
				let data = {
					followId:this.userInfo.user.openId,
					openid:this.$store.state.userOpenID,
					followPhoto:this.userInfo.user.userPot,
					followOfferAuthentication:this.userInfo.user.offerAuthentication,
					followName:this.userInfo.user.userName
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:'/Message/insertUserFollow',
					method: 'post',
					data
				}).then(function({data}) {
					console.log(data)
					that.isfollow = true
					that.followSrc = '../../static/pic/detail/following.svg'
					uni.showToast({
						icon: 'none',
						title: '关注成功！',
						duration: 1000
					});
					// 关注成功后同步本地的数据 
					that.$store.commit('updateUserFollowNum',1)
					that.refreshFollowList(that.userInfo.user.openId)
				}).catch(err => {
					console.log(err)
				})
			},
			// 取消关注
			unfollowOther: function() {
				let that = this
				this.$axios.request({
					url: `/Message/DeleteFollow`,
					method: 'get',
					params: {
						openid:this.$store.state.userOpenID,
						followId:this.userInfo.user.openId
					}
				}).then(function({data}) {
					console.log(data)
					that.isfollow = false
					that.followSrc = '../../static/pic/detail/follow.svg'
					uni.showToast({
						icon: 'none',
						title: '取消关注！',
						duration: 1000
					});
					that.$store.commit('updateUserFollowNum',-1)
					that.refreshFollowList(that.userInfo.user.openId)
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取他人用户信息
			getOtherInfo: function(id) {
				let that = this
				this.$axios.request({
					url: `/user/searchById`,
					method: 'get',
					params: {
						openid:id
					}
				}).then(function({data}) {
					console.log(data)
					that.userInfo = data.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取用户的关注列表，比对是否关注
			getSelfFollowList:function(openId){
				if(this.$store.state.followList !== ''){
					for(let i = 0;i<this.$store.state.followList.length;i++){
						if(this.$store.state.followList[i].followId === openId){
							this.isfollow = true
							return
						}	
					}
				}
				else{
					this.refreshFollowList(openId)
				}
			},
			// 刷新followlist
			refreshFollowList:function(openId){
				let that = this
				this.$axios.request({
					url: `/Message/follow`,
					method: 'get',
					params: {
						openid:this.$store.state.userOpenID
					}
				}).then(function({data}) {
					console.log(data)
					// 关注列表存储到全局 
					that.$store.commit('updateFollowList',data.data)
					for(let i =0;i<data.data.length;i++){
						if(data.data[i].followId === openId){
							that.isfollow = true
							return
						}	
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 切换到用户的发布等详情页
			switchToOtherDetail:function(id){
				// id为1时转到他人发布
				if(id === 1){
					uni.navigateTo({
						url:`../otherPublish/otherPublish?type=1&openId=${this.userInfo.user.openId}`
					})
				}
				// 2他人关注
				if(id === 2){
					if(this.userInfo.user.isLockFollow === 1){
						uni.showToast({
							title:'该用户未开放查看权限哦',
							icon:'none'
						})
					}
					else{
						uni.navigateTo({
							url:`../otherFollow/otherFollow?openId=${this.userInfo.user.openId}`
						})
					}
				}
				// 3他人解锁
				if(id === 3){
					if(this.userInfo.user.isLockCollection === 1){
						uni.showToast({
							title:'该用户未开放查看权限哦',
							icon:'none'
						})
					}
					else{
						uni.navigateTo({
							url:`../otherPublish/otherPublish?type=2&openId=${this.userInfo.user.openId}`
						})
					}
				}
			},
			// 切割offer
			cutOffer:function(offerlist){			
				if(offerlist === null){
					return
				}
				let temp = offerlist.OfferAuthentication.split('/')
				for(let i = 0;i<temp.length;i++){
					if(temp[i] === ''){
						temp.splice(i,1)
					}
				}
				console.log(temp)
				for(let j = 0;j<temp.length;j++){
					if(temp[j].substring(0,3) === '实习|'){
						this.internship.push(temp[j].substring(3))
						console.log(this.internship)
					}
					if(temp[j].substring(0,3) === '全职|'){
						this.fulltime.push(temp[j].substring(3))
						console.log(this.fulltime)
					}
				}	
			}
			
		},
		onLoad: function(options) {
			console.log(options)
			let openId = options.openId
			// 获取关注人信息
			this.getOtherInfo(openId)
			this.baseUrl = this.$store.state.baseUrl
			// 获取个人关注信息
			this.getSelfFollowList(openId)
		},
		mounted() {
			// 获取右上胶囊位置，决定返回键的位置
			let that = this
			let menuButton = uni.getMenuButtonBoundingClientRect()
			let centerPos = menuButton.bottom - menuButton.height / 2
			const query = uni.createSelectorQuery().in(this);
			query.select('#backIcon').boundingClientRect(data => {
				console.log(data)
				that.iconHeight = data.height / 2
				let iconPos = centerPos - that.iconHeight
				that.backIconPos = iconPos
			}).exec();
		}
	}
</script>

<style lang="less" scoped>
	.head {
		position: relative;

		// 用户头部
		.profile-head {
			width: 100%;
			height: 250upx;
			background-color: #00A29A;
			border-radius: 0 0 20upx 20upx;
			position: relative;
			overflow: hidden;

			image {
				width: 130%;
				height: 130%;
				position: absolute;
				top: 0upx;
			}

			.backIcon {
				width: 18upx;
				height: 34upx;
				position: absolute;
				top: 72upx;
				left: 20upx;
			}
		}
		// 头像
		.avatar {
			width: 136upx;
			height: 136upx;
			position: absolute;
			bottom: -68upx;
			left: 40upx;
			border-radius: 50%;
		}
		// 大v标志
		.dav{
			display: flex;
			align-items: center;
			position: absolute;
			bottom: -70upx;
			left: 138upx;
			image{
				width: 40upx;
				height: 40upx;
				border-radius: 50%;
			}
			text{
				margin-left: 8upx;
				font-size: 24upx;
				color: #BDBDBD;
			}
		}
	}

	// 用户名及标签
	.nickname {
		margin: 84upx 40upx 0 40upx;

		.upArea {
			display: flex;
			align-items: center;

			text {
				font-size: 36upx;
			}
		}

		.downArea {
			display: flex;
			align-items: center;
			margin-top: 14upx;

			text {
				font-size: 16upx;
				color: #FFFFFF;
				background-color: #F2C94C;
				padding: 2upx 6upx;
				border-radius: 6upx;
				margin-right: 10upx;
			}

			.fulltime {
				background-color: #00a29a;
			}
		}
	}

	// 用户数据
	.userdata {
		margin: 40upx 36upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		view {
			color: #4F4F4F;
			width: 100upx;
			height: 100upx;
			text-align: center;

			text {
				display: block;

				&:nth-child(1) {
					font-size: 44upx;
					font-weight: bold;
				}

				&:nth-child(2) {
					font-size: 24upx;
				}
			}

			&:last-child {
				width: 140upx;
				height: 67upx;
				border-radius: 20upx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	// offer认证
	.identify {
		margin: 60upx 36upx 0 36upx;
		display: flex;
		align-items: center;

		image {
			width: 48upx;
			height: 40upx;

			&:last-child {
				width: 24upx;
				height: 24upx;
				margin-left: auto;
			}
		}

		text {
			margin-left: 28upx;
			font-size: 28upx;
		}
	}

	// offer认证的具体内容
	.offer {
		margin: 40upx 36upx 0 80upx;
		display: flex;
		align-items: center;

		//logo
		image {
			width: 80upx;
			height: 80upx;
			flex-shrink: 0;
		}

		// 职位公司名
		.position {
			margin-left: 36upx;

			text {
				display: block;

				&:nth-child(1) {
					font-size: 24upx;
				}

				&:nth-child(2) {
					font-size: 20upx;
					color: #4F4F4F;
				}
			}
		}

		// 状态
		.status {
			margin-left: auto;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			.internship {
				font-size: 20upx;
				color: #FFFFFF;
				background-color: #f2c94c;
				border-radius: 10upx;
				padding: 2upx 16upx;
			}

			.fulltime {
				font-size: 20upx;
				color: #FFFFFF;
				background-color: #00A29A;
				border-radius: 10upx;
				padding: 2upx 16upx;
			}

			image {
				width: 12upx;
				height: 18.6upx;
				margin-left: 18upx;
			}
		}
	}

	// 教育经历详情
	.edu {
		margin: 40upx 36upx 0 80upx;
		display: flex;
		align-items: center;

		//logo
		image {
			width: 80upx;
			height: 80upx;
			flex-shrink: 0;
		}

		// 职位公司名
		.position {
			margin-left: 36upx;

			text {
				display: block;

				&:nth-child(1) {
					font-size: 24upx;
				}

				&:nth-child(2) {
					font-size: 20upx;
					color: #4F4F4F;
				}
			}
		}

		// 状态
		.status {
			margin-left: auto;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			text {
				font-size: 20upx;
				color: #BDBDBD;
			}
		}
	}

	// 个人技能标签
	.skill {
		margin: 40upx 36upx 0 80upx;
		display: flex;
		align-items: center;

		text {
			margin-right: 14upx;
			color: #FFFFFF;
			background-color: #00A29A;
			padding: 6upx 16upx;
			font-size: 20upx;
			border-radius: 14upx;
		}
	}
</style>
