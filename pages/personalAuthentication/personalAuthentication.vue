<template>
	<view class="identity">
		<!-- 顶部提示 -->
		<view class="notice">
			<text v-if="firstFlag===true && offerFlag === true">第一次进行offer验证前需进行身份验证，身份验证通过后则无需再次验证，</text>
			<text v-if="firstFlag===false">身份认证未通过时，进行offer验证前需重新认证，身份验证通过后则无需再次验证，</text>
			<text>姓名和身份证件仅用于审核，审核后豆豆会立刻删除相关材料，大家放心哦！</text>
		</view>
		<!-- 真实姓名 -->
		<view class="realname">
			<view class="title">
				<text>*\t</text>
				真实姓名
			</view>
			<view>
				<input type="text" v-model="realname"/>
			</view>
		</view>
		<!-- 上传图片 -->
		<view class="upload-pic">
			<view class="title">
				<text>*\t</text>
				上传学生证图片（可用身份证代替）
			</view>
			<view class="upload">
				<view @click="selectPic(1)" v-if="fontPicSrc === ''">
					<image src="../../static/pic/me/add-slim.svg"></image>
					正面
				</view>
				<image :src="fontPicSrc" mode="aspectFill" class="font-pic" @click="selectPic(1)" v-if="fontPicSrc !== ''"></image>
				<view @click="selectPic(2)" v-if="backPicSrc === ''">
					<image src="../../static/pic/me/add-slim.svg"></image>
					背面
				</view>
				<image :src="backPicSrc" mode="aspectFill" class="font-pic" @click="selectPic(2)" v-if="backPicSrc !== ''"></image>
			</view>
		</view>
		
		<!-- 同意相关条款 -->
		<view style="height: 210upx;">
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;background-color: #FFFFFF;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);">
			<view class="provision">
				<view class="okWhite" :class="isProvisionSelected?'okGreen':''" @click="selectProvision">
					<image :src="provisionPicSrc" mode=""></image>
				</view>
				<text @click="switchToProvision">我同意相关条款协议</text>
			</view>
			<!-- 确认 -->
			<view class="confirm">
				<button @click="confirm">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				fontPicSrc:'',
				backPicSrc:'',
				// 条款是否选中
				isProvisionSelected: true,
				provisionPicSrc: '../../static/pic/me/ok-white.svg',
				// 真实姓名
				realname:'',
				firstFlag:false,
				offerFlag:false
			}
		},
		methods:{
			// 选择图片
			selectPic:function(i){
				let that = this
				uni.chooseImage({
					count:1,
					success(res) {
						if(i === 1){
							that.checkImgSecurity(res.tempFilePaths[0],0)

						}
						if(i === 2){
							that.checkImgSecurity(res.tempFilePaths[0],1)
						}
					}
				})
			},
			// 条款选中
			selectProvision: function() {
				if (this.isProvisionSelected === false) {
					this.isProvisionSelected = true
					this.provisionPicSrc = '../../static/pic/me/ok-white.svg'
				} else {
					this.isProvisionSelected = false
					this.provisionPicSrc = '../../static/pic/me/ok.svg'
				}
			},
			// 切换至条款页面 
			switchToProvision:function(){
				uni.navigateTo({
					url:'../provision/provision'
				})
			},
			// 确认提交
			confirm:function(){
				if(this.realname.match(/^[ ]*$/)){
					uni.showToast({
						title:'请填写真实姓名！',
						icon:'none'
					})
					return
				}
				if(this.fontPicSrc === ''){
					uni.showToast({
						title:'请上传照片！',
						icon:'none'
					})
					return
				}
				if(this.isProvisionSelected === false){
					uni.showToast({
						title:'请勾选同意相关条款协议！',
						icon:'none'
					})
					return
				}
				this.checkTextSecurity()
			},
			// 判断用户是否授权了订阅消息
			getUserAuthInfo:function(){
				let that = this
				wx.getSetting({
					withSubscriptions: true,
					 success(res) {
					    var itemSettings = res.subscriptionsSetting.itemSettings
					    if (itemSettings) {
					      if (itemSettings['trUpUuXNMNbMAlTnl9yOtXuf8wAghJM7OtBJYWl5NPc'] === 'accept' && itemSettings['x0Scd2YPW_MczSbR1uonfDQsT9tZTh6JBuijMXX1hvU'] === 'accept') {
					          that.uploadFontPic()
					      }else{
							  wx.requestSubscribeMessage({
							    tmplIds: ['trUpUuXNMNbMAlTnl9yOtXuf8wAghJM7OtBJYWl5NPc','x0Scd2YPW_MczSbR1uonfDQsT9tZTh6JBuijMXX1hvU'],
							    success (res) { 
							  	  that.uploadFontPic()
							    },
								fail(err){
									console.log(err)
									that.uploadFontPic()
								}
							  })
						  }
					    }
						else{
							console.log('进入了没有授权设置')
							wx.requestSubscribeMessage({
								tmplIds: ['trUpUuXNMNbMAlTnl9yOtXuf8wAghJM7OtBJYWl5NPc','x0Scd2YPW_MczSbR1uonfDQsT9tZTh6JBuijMXX1hvU'],
								success (res) { 
									console.log('授权成功！')
									that.uploadFontPic()
								},
								fail(err) {
									console.log('授权失败！')
									that.uploadFontPic()
								}
							})
						}
					 },
					 fail(err) {
					 	console.log(err)
					 }
				})
			},
			
			// 上传身份照片正面
			uploadFontPic:function(){
				uni.showLoading({
					title: '上传照片中...',
					mask: true,
				})
				let that = this
				console.log(this.fontPicSrc)
				uni.uploadFile({
					url: this.$store.state.baseUrl + '/image/upFile',
					filePath: this.fontPicSrc,
					name: 'file',
					formData: {
						path:`user/${this.$store.state.userOpenID}`
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode!==200){
							uni.hideLoading()
							uni.showToast({
								icon:'none',
								title:'上传失败！',
							})
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code !== 200){
							uni.hideLoading()
							uni.showToast({
								title:'上传图片失败！',
								icon:'none'
							})
							return
						}
						if(that.backPicSrc === ''){
							that.uploadIndentity(data.data)
						}
						else{
							that.uploadBackPic(data.data)
						}
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							icon:'none',
							title:'上传失败！'
						})
						return
					},
				})
			},
			// 上传身份照片
			uploadBackPic:function(fontPic){
				let that = this
				uni.uploadFile({
					url: this.$store.state.baseUrl + '/image/upFile',
					filePath: this.backPicSrc,
					name: 'file',
					formData: {
						path:`user/${this.$store.state.userOpenID}`
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode!==200){
							uni.hideLoading()
							uni.showToast({
								icon:'none',
								title:'上传失败！',
							})
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code !== 200){
							uni.hideLoading()
							uni.showToast({
								title:'上传图片失败！',
								icon:'none'
							})
							return
						}
						that.uploadIndentity(fontPic,data.data)
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							icon:'none',
							title:'上传失败！'
						})
						return
					},
				})
			},
			
			// 上传身份认证
			uploadIndentity:function(fontPic,backPic){
				let that = this
				let data = {
					openid:this.$store.state.userOpenID,
					name:this.realname,
					fileIdentityCard0:fontPic,
					fileIdentityCard1:backPic
				}
				this.$axios.request({
					url:`/user/upDataUserAuthentication`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					uni.showToast({
						title:'上传成功！'
					})
					that.switchToSuccessPage()
				}).catch(err => {
					console.log(err)
				})
			},
			switchToSuccessPage:function(){
				if(this.offerFlag){
					uni.reLaunch({
						url:'../offerAuthenticationv2/offerAuthenticationv2'
					})
				}
				else{
					uni.reLaunch({
						url:'../authenticationSuccess/authenticationSuccess?type=person'
					})
				}
			},
			// 上传文本的安全校验
			checkTextSecurity:function(){
				let that = this
				let data = {
					text:this.realname
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/wx/checkText`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					that.getUserAuthInfo()
				}).catch(err => {
					console.log(err)
				})
			},
			// 上传图片的安全校验
			checkImgSecurity:function(file,type){
				uni.showLoading({
					title: '图片校验中...',
					mask: true,
				})
				let that = this
				uni.uploadFile({
					url: this.$store.state.baseUrl + '/wx/checkPic',
					filePath:file,
					name: 'file',
					formData: {},
					success: (res) => {
						console.log(res)
						if(res.statusCode!==200){
							uni.hideLoading()
							uni.showToast({
								icon:'none',
								title:'图片校验失败！',
							})
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code !== 200){
							uni.hideLoading()
							uni.showToast({
								title:data.message,
								icon:'none'
							})
							return
						}
						if(type === 0){
							uni.hideLoading()
							that.fontPicSrc = file
							return
						}
						if(type === 1){
							uni.hideLoading()
							that.backPicSrc = file
							return
						}
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							icon:'none',
							title:'上传图片失败！'
						})
						return
					}
				});
			}
		},
		onLoad:function(options) {
			// 判断是单独进来还是通过offer认证进入
			if(options.offer){
				this.offerFlag = true
			}
			if(this.$store.state.userInfoPlatform.user.name === null){
				this.firstFlag = true
			}
		}
	}
</script>

<style lang="less" scoped>
	// 提示
	.notice{
		font-size: 20upx;
		color: #BDBDBD;
		text-align: justify;
		margin: 0 36upx;
		text{
			&:nth-child(1){
				color: #00a29a;
			}
			&:nth-child(2){
				color: #BDBDBD;
			}
		}
		
	}
	// 真是姓名
	.realname{
		margin:40upx 36upx;
		font-size: 24upx;
		// 标题
		.title{
			text{
				color: #00a29a;
			}
		}
		// 姓名输入框
		input{
			background-color: #F2F2F2;
			padding: 18upx 24upx;
			border-radius: 20upx;
			margin-top: 10upx;
		}
	}
	// 上传照片
	.upload-pic{
		margin:40upx 36upx;
		font-size: 24upx;
		// 标题
		.title{
			text{
				color: #00a29a;
			}
		}
		
		// 上传控件
		.upload{
			margin-top: 20upx;
			display: flex;
			align-items: center;
			view{
				margin-right: 40upx;
				box-sizing: border-box;
				width: 200upx;
				height: 200upx;
				border: 3px dashed #E0E0E0;
				border-radius: 20upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #BDBDBD;
				font-size: 24upx;
				image{
					width: 60upx;
					height: 60upx;
					margin-bottom: 12upx;
				}
			}
				
			.font-pic{
				width: 200upx;
				height: 200upx;
				border-radius: 20upx;
				margin-right: 40upx;
			}
		}
	}
	// 条款
	.provision {
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20upx;
		color: #00A29A;
	
		// 白色
		.okWhite {
			box-sizing: border-box;
			width: 30upx;
			height: 30upx;
			border: 1.5px solid #BDBDBD;
			border-radius: 4upx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10upx;
	
			image {
				width: 20upx;
				height: 20upx;
			}
		}
	
		// 选中绿色
		.okGreen {
			border: 1.5px solid #00A29A;
			background-color: #00A29A;
		}
	}
	// 确认按钮
	.confirm {
		margin: 30upx 0;
		display: flex;
		justify-content: center;
	
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #00A29A;
			width: 500upx;
			height: 100upx;
			border-radius: 20upx;
			color: #FFFFFF;
		}
	}
</style>
