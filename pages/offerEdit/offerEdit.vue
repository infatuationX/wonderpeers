<template>
	<view id="authentication" @click="closeSearchArea">
		<!-- offer类型 -->
		<view class="offer-type">
			<view class="title">
				<text>*\t</text>
				Offer类型
			</view>
			<view class="type">
				<view @click="offerTypeSelect(1)" :class="isFulltimeSelect?'selected':''">
					全职offer
				</view>
				<view @click="offerTypeSelect(2)" :class="isInternshipSelect?'selected':''">
					实习offer
				</view>
			</view>
		</view>
		<!-- 公司名称 -->
		<view class="com-name">
			<view class="title">
				<text>*\t</text>
				公司名称
			</view>
			<!-- 名称输入 -->
			<view class="input-area" >
				<view class="input-line">
					<input type="text" placeholder="请填写公司名称" v-model="companyName" @input="onComInput"/>
				</view>
				<view class="search-area" @click.stop="searchClick" v-if="isCompanyInput">
					<scroll-view scroll-y="true" class="scroll-style" @scrolltolower="searchToBottom">
						<view class="scroll-item">
							
						</view>
						<view class="scroll-item" v-for="(item,i) in logoList" :key="i" @click="searchItemClick(i)">
							<image :src="`${baseUrl}/file/${item.url}`" mode=""></image>
							<text>{{item.logoname}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 职位名称 -->
		<view class="position">
			<view class="title">
				<text>*\t</text>
				职位名称
			</view>
			<!-- 名称输入 -->
			<view>
				<input type="text" placeholder="请填写职位名称" v-model="position" />
			</view>
		</view>
		<!-- 图片认证 -->
		<view class="pic">
			<view class="title">
				<text>*\t</text>
				Offer图片验证
			</view>
			<view class="pic-notice">
				可上传邮件/Offer Letter截图，需清晰展示
				<text>个人姓名+公司名称+职位名称</text>
			</view>
			<!-- 图片 -->
			<view class="editPic">
				<view v-for="(item,i) in originImgList" :key="i" class="preImage">
					<image :src="`${baseUrl}/file/${item}`" mode="aspectFill" class="smallpic" @click="previewImage(i)"></image>
					<image src="../../static/pic/me/x.svg" mode="" class="closePicImg" @click="deleteOriginPic(i)"></image>
				</view>
				<view v-for="(item,i) in imglist" :key="i" class="preImage">
					<image :src="item" mode="aspectFill" class="smallpic" @click="previewImage(i + originImgList.length)"></image>
					<image src="../../static/pic/me/x.svg" mode="" class="closePicImg" @click="deletePic(i)"></image>
				</view>
				<view class="selectImage" @click="selectImage">
					<image src="../../static/pic/me/add-slim.svg" mode=""></image>
				</view>
			</view>
			<view style="clear: both;">

			</view>
		</view>
		<view style="height: 210upx;padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);">

		</view>
		<!-- 底部按钮 -->
		<view class="bottom-btn">
			<button @click="deleteNotice">删除</button>
			<button @click="confirm">保存</button>
		</view>
		<!-- 删除警告弹窗 -->
		<uni-popup-sp ref="deletePopup" type="center">
			<view class="delete-notice">
				<view class="title">
					确认删除此offer认证？
				</view>
				<view class="notice">
					删除后将无法找回	
				</view>
				<view class="notice">
					该 Offer 已获得的豆子奖励会丢失哦
				</view>
				<view class="btngroup">
					<button type="default" @click="$refs.deletePopup.close()">取消</button>
					<button type="default" @click="deleteOffer">确认</button>
				</view>
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
				isFulltimeSelect: false,
				isInternshipSelect: false,
				// 图片列表
				imglist: [],
				// 条款是否选中
				isProvisionSelected: false,
				provisionPicSrc: '../../static/pic/me/ok.svg',
				// 公司名称
				companyName: '',
				// 职位
				position: '',
				// 检测公司输入状态
				isCompanyInput:false,
				// 临时上传文件结果
				tempUploadImgPathList:[],
				// 匹配logo的搜索结果
				logoList:'',
				// 匹配logo的当前页
				currentPage:1,
				// 公司logo
				companyIcon:'',
				// 请求基地址
				baseUrl:'',
				// offer信息
				offerInfo:[],
				// 原始offer认证图片列表
				originImgList:[],
				// offerid,用于修改offer
				offerId:0
			}
		},
		methods: {
			// offer类型点击
			offerTypeSelect: function(i) {
				if (i === 1) {
					this.isFulltimeSelect = true
					this.isInternshipSelect = false
				}
				if (i === 2) {
					this.isInternshipSelect = true
					this.isFulltimeSelect = false
				}
			},
			// 上传图片
			selectImage: function() {
				let that = this
				let length = this.imglist.length + this.originImgList.length
				if(length === 3){
					uni.showToast({
						title:'最多选择3张图片!',
						icon:'none'
					})
					return
				}
				uni.chooseImage({
					sizeType: 'original',
					count: 3 - length,
					success(res) {
						console.log(res)
						that.checkImgSecurity(res.tempFilePaths,0)
					}
				})
			},
			// 删除图片
			deletePic: function(index) {
				this.imglist.splice(index, 1)
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
			// 预览照片
			previewImage: function(i) {
				let temp=[]
				for(let i = 0;i<this.originImgList.length;i++){
					temp.push(this.$store.state.baseUrl + '/file/'+ this.originImgList[i])
				}
				temp.push(...this.imglist)
				uni.previewImage({
					urls: temp,
					current: i
				})
			},
			// 提交函数
			confirm: function() {
				if (this.isFulltimeSelect === false && this.isInternshipSelect === false) {
					uni.showToast({
						title: '请选择offer类型！',
						icon: 'none'
					})
					return
				}
				if (this.companyName.match(/^[ ]*$/)) {
					uni.showToast({
						title: '请输入公司名称！',
						icon: 'none'
					})
					return
				}
				if (this.position.match(/^[ ]*$/)) {
					uni.showToast({
						title: '请输入职位名称！',
						icon: 'none'
					})
					return
				}
				if (this.imglist.length === 0 && this.originImgList.length === 0) {
					uni.showToast({
						title: '请上传图片验证！',
						icon: 'none',
					})
					return
				}
				this.checkTextSecurity()
				
			},
			// 多张图片的上传
			uploadMultipleImage: function(i) {
				uni.showLoading({
					title: '上传中...',
					mask: true,
				})
				let that = this
				uni.uploadFile({
					url: this.$store.state.baseUrl + '/image/upFile',
					filePath: this.imglist[i],
					name: 'file',
					formData: {
						path:`user/${this.$store.state.userOpenID}`
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode !== 200){
							uni.hideLoading()
							uni.showToast({
								icon:'none',
								title:'上传图片失败!',
							})
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						// code的位置
						if(data.code !== 200){
							uni.hideLoading()
							uni.showToast({
								title:'上传图片失败！',
								icon:'none'
							})
							return
						}
						that.tempUploadImgPathList.push(data.data)
						if (i === that.imglist.length -1) { //当图片传完时，停止调用
							console.log('执行完毕');
							that.$nextTick(function(){
								that.uploadOffer()
							})
						} else { //若图片还没有传完，则继续调用函数
							that.uploadMultipleImage(i+1); //递归，回调自己
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
					}
				});
			},
			// 上传offer具体内容
			uploadOffer:function(){
				let that = this
				// offer类型
				let workType = ''
				if(this.isFulltimeSelect){
					workType = '全职'
				}
				if(this.isInternshipSelect){
					workType = '实习'
				}
				// offer图片数组
				let offerPhoto = ['','','']
				for(let i = 0;i<this.originImgList.length;i++){
					offerPhoto[i] = this.originImgList[i]
				}
				for(let j = 0;j<this.tempUploadImgPathList.length;j++){
					offerPhoto[j+this.originImgList.length] = this.tempUploadImgPathList[j]
				}
				// 请求的data
				let data = {
					id:this.offerId,
					label:0,
					openId:this.$store.state.userOpenID,
					workType:workType,
					companyName:this.companyName,
					position:this.position,
					logo:this.companyIcon,
					userName:this.$store.state.userInfoPlatform.user.userName,
					offerPhoto0:offerPhoto[0],
					offerPhoto1:offerPhoto[1],
					offerPhoto2:offerPhoto[2]
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/updateWorkExperience`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// 请求拦截
					uni.hideLoading()
					// 同步个人信息
					that.updateUserinfo()
					that.switchToSuccess(workType)
				}).catch(err => {
					console.log(err)
				})
			},
			// 切换至条款
			switchToProvision:function(){
				uni.navigateTo({
					url:'../provision/provision'
				})
			},
			// 匹配区域点击事件
			searchClick:function(){
				return
			},
			// 学校输入事件
			onComInput:function(){
				if(this.companyName.match(/^[ ]*$/)){
					this.isCompanyInput = false
					return
				}
				else{
					this.isCompanyInput = true
					this.searchLogo(10,1)
				}
			},
			// 搜索匹配点击
			searchItemClick:function(i){
				this.companyName = this.logoList[i].logoname
				this.companyIcon = this.logoList[i].url
				this.isCompanyInput = false 
			},
			// 全局关闭搜索框
			closeSearchArea:function(){
				if(this.isCompanyInput === true){
					console.log('关闭搜索框')
					this.isCompanyInput = false
				}	 
			},
			// 切换到成功页面
			switchToSuccess:function(type){
				uni.reLaunch({
					url:`../authenticationSuccess/authenticationSuccess?type=edit&comName=${this.companyName}&comIcon=${this.companyIcon}&position=${this.position}&offertype=${type}`
				})
			},
			// 搜索匹配logo
			searchLogo:function(pageSize,pageNum){
				let that = this
				this.$axios.request({
					url:`/Message/searchLogo`,
					method:'get',
					params:{
						name:this.companyName,
						pageSize:pageSize,
						pageNum:pageNum,
					}
				}).then(function({data}){
					console.log(data)
					if(pageNum === 1){
						that.logoList = []
					}
					that.logoList.push(...data.data.list)
					that.currentPage = data.data.pageNum
					if(data.data.list.length === 0){
						setTimeout(function() {
							that.isCompanyInput = false
						}, 500);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// logo搜索触底
			searchToBottom:function(){
				this.searchLogo(10,this.currentPage+1)
			},
			// 删除offer的前置提示
			deleteNotice:function(){
				this.$refs.deletePopup.open()
			},
			// 删除offer认证
			deleteOffer:function(){
				let that = this
				this.$axios.request({
					url:`/user/deleteWorkExperience`,
					method:'get',
					params:{
						id:this.offerId,
					}
				}).then(function({data}){
					console.log(data)
					// 删除成功后,同步一次个人信息
					that.updateUserinfo()
					uni.showToast({
						title:'删除成功！',
						mask:true,
						success(res) {
							setTimeout(function() {
								uni.switchTab({
									url:'../profile/profile'
								})
							}, 500);
						}
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取待修改offer信息
			getOfferInfo:function(id){
				console.log(id)
				let offer = this.$store.state.userInfoPlatform.workexperiences
				for(let i = 0;i<offer.length;i++){
					if(id == offer[i].id){
						this.offerInfo = offer[i]
						this.$nextTick(function(){
							this.drawOfferEditPage()
						})
						return
					}
				}
			},
			// 渲染修改page
			drawOfferEditPage:function(){
				// 渲染原始的offer图片
				if(this.offerInfo.offerPhoto0 !== ''){
					this.originImgList.push(this.offerInfo.offerPhoto0)
				}
				if(this.offerInfo.offerPhoto1 !== ''){
					this.originImgList.push(this.offerInfo.offerPhoto1)
				}
				if(this.offerInfo.offerPhoto2 !== ''){
					this.originImgList.push(this.offerInfo.offerPhoto2)
				}
				// 渲染职位选择
				if(this.offerInfo.workType === '全职'){
					this.isFulltimeSelect = true
				}
				if(this.offerInfo.workType === '实习'){
					this.isInternshipSelect = true
				}
				this.companyName = this.offerInfo.companyName
				this.companyIcon = this.offerInfo.logo
				this.position = this.offerInfo.position
			},
			// 删除原始照片
			deleteOriginPic:function(i){
				this.originImgList.splice(i, 1)
			},
			// 修改成功刷新个人缓存
			updateUserinfo:function(){
				let that = this
				this.$axios.request({
					url:`/user/searchById`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID
					}
				}).then(function({data}){
					console.log(data)
					that.$store.commit('saveUserinfoPlatform',data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取用户的订阅信息
			getUserAuthInfo:function(){
				let that = this
				// 获取订阅的授权
				wx.getSetting({
					withSubscriptions: true,
					 success(res) {
						console.log('获取用户设置成功！')
					    var itemSettings = res.subscriptionsSetting.itemSettings
						// 如果有授权
					    if (itemSettings) {
					      if (itemSettings['trUpUuXNMNbMAlTnl9yOtXuf8wAghJM7OtBJYWl5NPc'] === 'accept' && itemSettings['x0Scd2YPW_MczSbR1uonfDQsT9tZTh6JBuijMXX1hvU'] === 'accept') {
							  console.log('已订阅')
					          if(that.imglist.length === 0){
								 console.log(that.imglist)
					          	that.uploadOffer()
					          }
					          else{
								 console.log(that.imglist)
					          	that.uploadMultipleImage(0)
					          }
					      }else{
							  console.log('未订阅')
							  // 没授权则拉起授权
							  wx.requestSubscribeMessage({
							    tmplIds: ['trUpUuXNMNbMAlTnl9yOtXuf8wAghJM7OtBJYWl5NPc','x0Scd2YPW_MczSbR1uonfDQsT9tZTh6JBuijMXX1hvU'],
							    success (res) { 
									console.log('授权成功！')
									if(that.imglist.length === 0){
										that.uploadOffer()
									}
									else{
										that.uploadMultipleImage(0)
									}
							    },
								fail(err){
									console.log('授权失败！')
									if(that.imglist.length === 0){
										that.uploadOffer()
									}
									else{
										that.uploadMultipleImage(0)
									}
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
									if(that.imglist.length === 0){
										that.uploadOffer()
									}
									else{
										that.uploadMultipleImage(0)
									}
								},
								fail(err){
									console.log('授权失败！')
									if(that.imglist.length === 0){
										that.uploadOffer()
									}
									else{
										that.uploadMultipleImage(0)
									}
								}
							})
						}
					 },
					 fail(err) {
						console.log('获取用户设置失败！')
					 	console.log(err)
					 }
				})
			},
			// 上传文本的安全校验
			checkTextSecurity:function(){
				let that = this
				let data = {
					text:this.companyName+this.position
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
			checkImgSecurity:function(file,i){
				uni.showLoading({
					title: '图片校验中...',
					mask: true,
				})
				let that = this
				uni.uploadFile({
					url: this.$store.state.baseUrl + '/wx/checkPic',
					filePath:file[i],
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
						// 当文件传完时，停止调用
						if (i === file.length - 1) { 
							console.log('执行完毕')
							// 绘制水印
							uni.hideLoading()
							that.imglist.push(...file)
						} else { 
							// 递归，回调自己
							that.checkImgSecurity(file,i+1)
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
			// 获取id
			this.offerId = options.id
			// 获取offer信息
			this.getOfferInfo(options.id)
			// 获取基地址
			this.baseUrl = this.$store.state.baseUrl
		}
	}
</script>

<style lang="less" scoped>
	// 提示
	.notice {
		font-size: 20upx;
		color: #BDBDBD;
		text-align: justify;
		margin: 0 36upx;
	}

	// offer类型
	.offer-type {
		margin: 40upx 36upx;
		font-size: 24upx;

		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}

		// 类型
		.type {
			display: flex;
			margin-top: 20upx;

			view {
				color: #BDBDBD;
				border: 1px solid #BDBDBD;
				padding: 18upx 20upx;
				border-radius: 20upx;
				margin-right: 20upx;
			}

			// 选中样式
			.selected {
				background-color: #00A29A;
				color: #FFFFFF;
				border: 1px solid #00A29A;
			}
		}
	}

	// 公司名
	.com-name {
		margin: 40upx 36upx;
		font-size: 24upx;
		position: relative;
		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}
		.input-area{
			position: relative;
			.input-line{
				z-index: 3;
				position: relative;
				input {
					background-color: #F2F2F2;
					padding: 18upx 24upx;
					border-radius: 20upx;
					margin-top: 10upx;
				}
			}
			// 搜索匹配框
			.search-area{
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 400upx;
				border-radius: 20upx;
				background-color: #FFFFFF;
				border: 1px solid #F2F2F2;
				z-index: 2;
				overflow: hidden;
				// 匹配结果的scrollview
				.scroll-style{
					height: 400upx;
					// 匹配结果单项
					.scroll-item{
						box-sizing: border-box;
						height: 80upx;
						display: flex;
						align-items: center;
						margin: 0 26upx;
						image{
							width: 44upx;
							height: 44upx;
							flex-shrink: 0;
						}
						// 
						text{
							color: #828282;
							font-size: 24upx;
							margin-left: 26upx;
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-all;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}
					}
				}
			}
		}
		
		.isHide {
			margin: 24upx;
			display: flex;
			align-items: center;
	
			image {
				width: 48upx;
				height: 28upx;
				margin-left: 16upx;
			}
		}
		
	}

	// 职位名
	.position {
		margin: 40upx 36upx;
		font-size: 24upx;

		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}

		input {
			background-color: #F2F2F2;
			padding: 18upx 24upx;
			border-radius: 20upx;
			margin-top: 10upx;
		}
	}

	
	// 图片认证
	.pic {
		margin: 40upx 36upx;
		font-size: 24upx;

		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}

		// 提示
		.pic-notice {
			margin-top: 8upx;
			font-size: 20upx;
			color: #BDBDBD;

			text {
				color: #00a29a;
			}
		}

		// 添加图片
		// 修改图片
		.editPic {
			margin-top: 20upx;

			.preImage {
				margin-right: 39upx;
				margin-bottom: 39upx;
				float: left;
				width: 200upx;
				height: 200upx;
				position: relative;

				.smallpic {
					border-radius: 20upx;
					width: 200upx;
					height: 200upx;
				}

				&:nth-child(3n+0) {
					margin-right: 0;
				}

				.closePicImg {
					width: 40upx;
					height: 40upx;
					position: absolute;
					top: -15upx;
					right: -15upx;
				}
			}

			.selectImage {
				margin-bottom: 39upx;
				float: left;
				width: 200upx;
				height: 200upx;
				position: relative;
				box-sizing: border-box;
				border: 3px dashed #E0E0E0;
				border-radius: 20upx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 60upx;
					height: 60upx;
				}
			}
		}
	}

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

	// 底部固定按钮
	.bottom-btn{
		background-color: #FFFFFF;
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
	// 删除警告弹窗
	.delete-notice{
		background-color: #FFFFFF;
		width: 446upx;
		border-radius: 20upx;
		overflow: hidden;
		.title{
			text-align: center;
			color: #4F4F4F;
			font-size: 36upx;
			font-weight: 500;
			margin-top: 48upx;
			margin-bottom: 24upx;
		}
		.notice{
			text-align: center;
			color: #828282;
			font-size: 20upx;
		}
		.btngroup{
			display: flex;
			justify-content: space-between;
			margin: 14upx 20upx 30upx 20upx;
			button {
				font-size: 28upx;
				width: 180upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 20upx;
			
				&:nth-child(1) {
					border: 1.5px solid #00A29A;
					color: #00A29A;
					background-color: #FFFFFF;
				}
			
				&:nth-child(2) {
					color: #FFFFFF;
					background-color: #00A29A;
				}
			}
		}
	}
</style>
