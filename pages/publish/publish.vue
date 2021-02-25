<template>
	<view id="publish">
		<!-- 授权button -->
		<button open-type="getUserInfo" class="getInfo-btn" @getuserinfo="getUserInfo" v-if="!isAuthorize"></button>
		<!-- 发布分类项 -->
		<view class="type-item" v-for="(item,i) in type" :key="i" :class="{selected:i===typeSelectMark}" @click="typeSelect(i)">
			<text>{{item.name}}</text>
			<image :src="item.path" mode=""></image>
		</view>
		<view class="notice">
			每成功分享一条干货，将收获平台赠与的 <text>+10</text> 颗豆子奖励 !
		</view>
		
		<view class="height: 120upx;clear: both;">
			
		</view>
		<!-- 豆子弹窗 -->
		<uni-popup-sp ref="peerpopup" type="center">
			<view class="peer-pop">
				<image src="../../static/pic/detail/peers.png" mode=""></image>
				+10
			</view>
		</uni-popup-sp>
	</view>

</template>

<script>
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	export default {
		components: {
			uniPopupSp
		},
		data() {
			return {
				type: [{
						name: '面经笔经',
						path: '../../static/pic/fontpage/bg1.svg'
					},
					{
						name: '资料分享',
						path: '../../static/pic/fontpage/bg4.svg'
					},
					{
						name: '讲座课程',
						path: '../../static/pic/fontpage/bg3.svg'
					},
					{
						name: '个人故事',
						path: '../../static/pic/fontpage/bg2.svg'
					},
				],
				// 选中标记
				typeSelectMark: -1,
				isAuthorize:false,
				baseUrl:''
			}
		},
		onShow() {
			this.setTabBarIndex(1) //index为当前tab的索引
		},
		methods: {
			// 面经选择
			typeSelect: function(i) {
				this.typeSelectMark = i
				let type = i
				let that = this
				uni.navigateTo({
					url: '../publishDetail/publishDetail?type=' + i,
					success() {
						setTimeout(function() {
							that.typeSelectMark = -1
						}, 1000);
					}
				})
			},
			// 获取用户信息
			getUserInfo: function() {
				let that = this
				uni.getUserInfo({
					success(res) {
						console.log(res.userInfo)
						if(that.$store.state.newPeople === true){
							that.openPeerDialog()
							that.updateAvatar(res.userInfo.nickName, res.userInfo.avatarUrl)
						}
						that.$store.commit('updateAuthState')
						that.isAuthorize = true
					},
					fail(res) {

					}
				})
			},
			// 仅在登录时使用
			// 登录时向服务器同步昵称
			updateUsername:function(nickName,avatar){
				// 发起请求
				let that = this
				let data = {
					openid:this.$store.state.userOpenID,
					userName:nickName,
					filePot:avatar,
					oldPot:''
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/upDataUserName`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// 同步本地数据
					that.$store.commit('updateAvatar',avatar)
					that.$store.commit('updateUsername',userName)
				}).catch(err => {
					console.log(err)
				})
			},
			// 同步头像
			updateAvatar:function(nickName,avatar){
				let that = this
				uni.downloadFile({
					url:avatar,
					success(res){
						console.log(res)
						if(res.statusCode!==200){
							uni.showToast({
								title:res.errMsg,
								icon:'none'
							})
							that.updateUsername(nickName,'')
							return
						}
						uni.uploadFile({
							url:`${that.baseUrl}/image/upFile`,
							filePath:res.tempFilePath,
							name:'file',
							formData:{
								path:`user/${that.$store.state.userOpenID}`
							},
							success(res){
								console.log(res)
								if(res.statusCode!==200){
									uni.showToast({
										icon:'none',
										title:'上传头像失败！',
									})
									that.updateUsername(nickName,'')
									return
								}
								let data = JSON.parse(res.data)
								console.log(data)
								if(data.code !== 200){
									uni.showToast({
										title:'上传头像失败！',
										icon:'none'
									})
									that.updateUsername(nickName,'')
									return
								}
								that.updateUsername(nickName,data.data)
							},
							fail(err){
								console.log(err)
							}
						})
					}
				})
			},
			// 打开豆子弹窗函数
			openPeerDialog:function(){
				return
			},
		},
		created() {
			this.isAuthorize = this.$store.state.isAuthorize,
			this.baseUrl = this.$store.state.baseUrl
		},
		watch:{
			// 监听是否授权的全局变化
			 "$store.state.isAuthorize": function() {
			    this.isAuthorize = this.$store.state.isAuthorize;
				
			 }
		}
	}
</script>

<style lang="less" scoped>
	#publish {
		margin-top: 200upx;
	}

	// 发布项
	.type-item {
		height: 200upx;
		margin: 48upx 36upx;
		border: 1px solid #F2FAFA;
		box-sizing: border-box;
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
		border-radius: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		text {
			color: #333333;
			font-size: 36upx;
			font-weight: 500;
		}

		image {
			position: absolute;
			bottom: -20upx;
			right: -20upx;
			width: 168upx;
			height: 194upx;
			opacity: 0.1;
		}
	}

	// 选中样式
	.selected {
		background: #F2FAFA;
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);

		text {
			color: #19AAA3;
		}
	}

	// 豆子弹窗
	.peer-pop {
		background-color: none;
		font-size: 56upx;
		color: #FFFFFF;
		display: flex;
		align-items: center;

		image {
			width: 140upx;
			height: 100upx;
			margin-right: 20upx;
		}
	}
	// 授权按钮
	.getInfo-btn{
		z-index: 10;
		width: 750upx;
		height: 2000upx;
		position: fixed;
		background-color: rgba(0,0,0,0);
		top: 0;
		left: 0;
		&::after{
			border: none;
		}
	}
	// 提示
	.notice{
		font-size: 24upx;
		font-weight: 500;
		margin: 44upx 0;
		display: flex;
		justify-content: center;
		color: #828282;
		text{
			color: #00a29a;
		}
	}
</style>
