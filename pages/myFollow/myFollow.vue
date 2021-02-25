<template>
	<view id="myFollow">
		<!-- 用户标签 -->
		<!-- 顶部权限开关 -->
		<view class="power-switch" v-if="followList.length !== 0" >
			<view >
				<text>允许他人查看</text>
				<image :src="isFollowAllowed?'../../static/pic/detail/open.svg':'../../static/pic/detail/close.svg'" mode="" @click="allowOther"></image>
			</view>
		</view>
		<view class="userTag" v-for="(item,i) in followList" :key = "i" @click="switchToOtherprofile(item.followId)" v-if="followList.length !== 0">
			<image :src="`${baseUrl}/file/${item.followPhoto}`" mode="aspectFill" class="avatar"></image>
			<view>
				<view class="upArea">
					<text>{{item.followName}}</text>
				</view>
				<view class="downArea">
					<text v-for="(label,j) in item.fulltime" :key= "j" class="fulltime">{{label}}</text>
					<text v-for="(label,j) in item.internship" :key= "j" >{{label}}</text>
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
				<text>这位小可爱</text>
				<text>你还没有关注过任何人</text>
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
					url:'../otherProfile/otherProfile?openId='+openId
				})
			},
			// 获取关注列表
			getMyFollow:function(){
				if(this.$store.state.followList !== ''){
					this.cutCompanyLabel(this.$store.state.followList)
				}
				else{
					let that = this
					this.$axios.request({
						url:`/Message/follow`,
						method:'get',
						params:{
							openid:this.$store.state.userOpenID
						}
					}).then(function({data}){
						console.log(data)
						// 存储到store
						that.$store.commit('updateFollowList',data.data)
						that.cutCompanyLabel(data.data) 
					}).catch(err => {
						console.log(err)
					})
				}
				
			},
			// 切割用户实习标签
			cutCompanyLabel:function(data){
				// 按'/'切割
				for (let i =0;i<data.length;i++){
					let temp = data[i].followOfferAuthentication.split('/')
					// 剔除空白
					for(let k = 0;k < temp.length;k++){
						if(temp[k] === ''){
							temp.splice(k,1)
						}
					}
					data[i].internship = []
					data[i].fulltime = []
					// 循环给实习全职赋值
					for(let j =0;j<temp.length;j++){
						if(temp[j].substring(0,3) === '实习|'){
							data[i].internship.push(temp[j].substring(3))
						}
						if(temp[j].substring(0,3) === '全职|'){
							data[i].fulltime.push(temp[j].substring(3))
						}
					}
				}
				this.followList = data
			},
			// 是否允许他人查看
			allowOther:function(){
				let that = this 
				let isAllow = 1
				// 检测当前为关闭状态时，赋值0打开
				if(this.isFollowAllowed === false){
					isAllow = 0
				}
				this.$axios.request({
					url:`/user/UpdateIslock`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID,
						ISLockC:this.$store.state.userInfoPlatform.user.isLockCollection,
						IsLockF:isAllow
					}
				}).then(function({data}){
					console.log(data)
					that.isFollowAllowed = !that.isFollowAllowed
					let tmpData = {
						isLockCollection:that.$store.state.userInfoPlatform.user.isLockCollection,
						isLockFollow:isAllow
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
		onLoad: function(){
			this.getMyFollow()
			if(this.$store.state.userInfoPlatform.user.isLockFollow === 0){
				this.isFollowAllowed = true
			}
			else{
				this.isFollowAllowed = false
			}
			this.baseUrl = this.$store.state.baseUrl
		},
		onShow: function(){
			this.getMyFollow()
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
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
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
