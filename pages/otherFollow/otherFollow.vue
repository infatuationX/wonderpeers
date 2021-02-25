<template>
	<view id="otherFollow">
		<!-- 用户标签 -->
		<view class="userTag" v-for="(item,i) in followList" :key = "i" @click="switchToOtherprofile(item.followId)" v-if="followList.length !== 0">
			<image :src="`${baseUrl}/file/${item.followPhoto}`" mode="" class="avatar"></image>
			<view>
				<view class="upArea">
					<text>{{item.followName}}</text>
				</view>
				<view class="downArea">
					<text v-for="(label,j) in item.label" :key= "j" :class="label.isFulltime?'fulltime':''">{{label.comName}}</text>
				</view>
			</view>
			<!-- 右边三角 -->
			<image src="../../static/pic/me/tri-gary.svg" mode="" class="tri"></image>
		</view>
		
		<!-- 未关注任何人 -->
		<view class="not-publish" v-if="followList.length === 0">
			<!-- 中部logo -->
			<view class="main-logo">
				<image src="../../static/pic/detail/green-peers.png" mode=""></image>
				<text>ta还没有关注过任何人</text>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				followList: [],
				isFollowAllowed:false,
				baseUrl:''
			}
		},
		methods:{
			switchToOtherprofile:function(openId){
				uni.navigateTo({
					url:`../otherProfile/otherProfile?openId=${openId}`
				})
			},
			// 获取关注列表
			getOtherFollow:function(openId){
				let that = this
				this.$axios.request({
					url:`/Message/follow`,
					method:'get',
					params:{
						openid:openId
					}
				}).then(function({data}){
					console.log(data)
					that.followList = data.data
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onLoad:function(options){
			this.getOtherFollow(options.openId)
			this.baseUrl = this.$store.state.baseUrl
		}
	}
</script>

<style lang="less" scoped>
	// 用户标签
	.userTag{
		margin: 20upx 36upx;
		background-color: #FFFFFF;
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
		border-radius: 20upx;
		height: 120upx;
		display: flex;
		align-items: center;
		// 头像
		.avatar{
			width: 80upx;
			height: 80upx;
			margin-left: 30upx;
			border-radius: 50%;
		}
		// 昵称
		.upArea{
			display: flex;
			align-items: center;
			margin-left: 10upx;
			font-size: 28upx;
		}
		// 标签区域
		.downArea{
			display: flex;
			align-items: center;
			margin-top: 4upx;
			text{
				font-size:16upx;
				color: #FFFFFF;
				background-color: #F2C94C;
				padding: 2upx 6upx;
				border-radius: 6upx;
				margin-left: 10upx;
			}
			// 全职的颜色
			.fulltime{
				background-color: #00a29a;
			}
		}
		// 右边三角
		.tri{
			width: 12upx;
			height: 18.62upx;
			margin-left: auto;
			margin-right: 20upx;
		}
	}
	
	// 未关注样式
	.not-publish{
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
