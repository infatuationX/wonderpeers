<template>
	<view id="pageDetailSelf">
		<!-- 标题头部 -->
		<view class="head">
			<text class="title">{{pageDetail.interviewexperience.title}}</text> 
			<!-- 未解锁状态 -->
			<view class="price-label">
				<!-- 价格不为0 -->
				<image :src="pageDetail.interviewexperience.price !== 0?'../../static/pic/fontpage/price-outline.png':'../../static/pic/fontpage/price-free.png'" mode="" class="bgimage" ></image> 
				<text class="free" v-if="pageDetail.interviewexperience.price === 0">FREE!</text> 
				<!-- 价格为Free -->
				<view class="peers-price" v-if="pageDetail.interviewexperience.price !== 0"> 
					<image src="../../static/pic/fontpage/logo-small.png" mode="" class="peers"></image> 
					<text class="price">x{{pageDetail.interviewexperience.price}}</text> 
				</view>
			</view>
			<!-- 背景图 -->
			<image :src="bgImageSrc" mode="" class="bg"></image> 
		</view>
		<!-- 头部占位 -->
		<view class="head-placeholder"> 
 
		</view> 
		<!-- 用户信息 -->
		<view class="user"> 
			<!-- 头像 -->
			<image :src="`${baseUrl}/file/${pageDetail.interviewexperience.userPot}`" mode="aspectFill" class="avatar"></image>  
			<!-- 昵称及标签 -->
			<view>
				<view class="up"> 
					<!-- 昵称 -->
					<text>{{pageDetail.interviewexperience.userName}}</text> 
					<!-- 标签 -->
					
				</view>
				<view class="down"> 
					<text :class="item.isFull?'fulltime':''" v-for="(item,i) in labelGroup" :key="i">{{item.name}}</text> 
				</view>
			</view>

			<!-- 右边分享按钮 -->
			<view class="share-btn"> 
				<image src="../../static/pic/fontpage/plane.svg" mode="" ></image>
				<button type="default" open-type="share"></button>
			</view>
			
		</view>
		<!-- 详情 -->
		<view class="detail">
			<text>{{pageDetail.interviewexperience.summary}}</text> 
		</view>

		<!-- 相关资料 -->
		<view class="information" > 
			<!-- 详细描述 -->
			<view class="information-block" v-if="pageDetail.interviewexperience.text !== '' && pageDetail.interviewexperience.text !== null">
				<view class="nametitle">
					<text>内容详情</text> 
				</view>
				<view >
					<!-- 详细描述内容 -->
					<text class="information-detail">{{pageDetail.interviewexperience.text}}</text> 
				</view>
			</view>
			
			<!-- 相关链接 -->
			<view class="information-block" v-if="linkList.length !== 0">
				<view class="nametitle"> 
					<text>相关链接</text>
				</view>
				<view style="transform: translateY(-12upx);">
					<view class="link" v-for="(item,i) in linkList" :key="i"> 
						<image src="../../static/pic/detail/link.svg" mode=""></image>
						<text>{{item.link}}</text> 
						<text class="copy" @click="copyToClipboard(item.link)">复制</text> 
						
					</view>
				</view>
			</view>
			<!-- 相关文件 -->
			<view class="information-block" v-if="fileList.length !== 0"> 
				<view class="nametitle"> 
					<text>相关文件</text>
				</view>
				<view style="transform: translateY(-12upx);">
					<view class="link" v-for="(item,i) in fileList" :key="i" @click="getFile(item.link)"> 
						<image src="../../static/pic/detail/file.svg" mode=""></image>
						<text>{{item.title}}</text> 
					</view>
				</view>
			</view>

			<!-- 图片 -->
			<view class="information-pic" v-if="imgList.length !== 0"> 
				<swiper :autoplay="true" :interval="2000" :duration="1000" class="swiper-style" @change="smallPicChange"> 
					<swiper-item v-for="(item,i) in imgList" :key="i" @click="picPreview(i)"> 
						<view class="swiper-item"> 
							<image :src="item" mode="aspectFill" class="swiper-pic"></image> 
						</view>
					</swiper-item>
				</swiper>
				<!-- 底部阴影遮罩 -->
				<view class="mask">

				</view>
				<!-- 自定义轮播图指示点 -->
				<swiper-dot class="dot" :current="current" :list="imgList"></swiper-dot> 
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comment">
			<!-- 聊天框背景 -->
			<view class="comment-bg"> 
				<!-- 评论区 -->
				<view class="comment-detail" v-for="(item,i) in pageDetail.dicusses" v-key="i" v-if="i < commentNum" > 
					<text>{{item.name}}：</text> 
					<text>{{item.discuss}}</text>
				</view>
				<!-- 查看更多 -->
				<view class="show-more" @click="showMore" v-if="commentNum ===  6">
					<text>点击查看更多</text> 
					<image src="../../static/pic/fontpage/Polygon.svg" mode=""></image>
				</view>
				<!-- 添加评论 -->
				<view class="add-comment"> 
					<text>评论：</text>
					<input type="text" confirm-type="send" @confirm="checkCommentSecurity" v-model="commentContent" /> 
				</view>
			</view>
		</view>
		<!-- 底部占位 -->
		<view class="block-bottom">
		</view>
		<!-- 底部tabbar -->
		<view class="tabbar">
			<!-- 解锁人数 -->
			<view class="people">
				<image src="../../static/pic/detail/people-grey.png" mode=""></image>
				<text>{{pageDetail.interviewexperience.unlockNum}}</text>
			</view>
			<!-- 收益豆子数 -->
			<view class="people">
				<image src="../../static/pic/detail/peers.png" mode="" class="peers"></image>
				<text>{{pageDetail.interviewexperience.allcost}}</text>
			</view>
			<!-- 喜欢数 -->
			<view class="people">
				<image src="../../static/pic/fontpage/heart.png" mode=""></image>
				<text>{{pageDetail.interviewexperience.colNum}}</text>
			</view>
			<button @click="switchToEdit">编辑修改</button>
		</view>
		
		<!-- 绘制分享图 -->
		<view style="position: absolute;top: -999999px;">
			<!-- canvas大小500*400 -->
			<view>
				<canvas style="width: 500px; height: 400px;" canvas-id="first" id="first"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import swiperDot from '@/components/swiper-dot/swiper-dot.vue'

	export default {
		components: {
			swiperDot,
		},
		data() {
			return {
				// 小轮播图点
				current: 0,
				// 评论列表
				commentList: [],
				// 测试用
				tempTest: true,
				// 评论用户名
				commentUsername: '二屁DL',
				commentContent: '',
				isFree:false,
				// 头像临时网络地址
				avatarUrl:'',
				// 面经细节
				pageDetail:{},
				// 用户label
				labelGroup:[],
				// 网络基础地址
				baseUrl:'',
				userInfo:{},
				// 三个内容list
				linkList:[],
				fileList:[],
				imgList:[],
				commentNum:0,
				// 背景图
				bgImageSrc:'',
				// 分享图片
				shareImg:''
			}
		},
		methods: {
			// 小图滚动函数
			smallPicChange: function(e) {
				this.current = e.detail.current;
			},

			// 预览图片
			picPreview: function(i) {
				uni.previewImage({
					current: i,
					urls: this.imgList,
				})
			},
			// 查看更多
			showMore: function() {
				this.commentNum = 999	
			},
			// 发送评论
			sendComment: function() {
				let that = this
				let unlock = 0
				if(this.isUnlock === true){
					unlock = 1
				}
				if (this.commentContent.match(/^[ ]*$/)) {
					return
				} else {
					let data = {
						id:this.pageDetail.interviewexperience.interviewexperienceId,
						openid:this.$store.state.userOpenID,
						discuss:this.commentContent,
						name:this.$store.state.userInfoPlatform.user.userName,
						unlock:unlock
					}
					data = this.$qs.stringify(data)
					this.$axios.request({
						url:`/interview/updateDicuss`,
						method:'post',
						data
					}).then(function({data}){
						console.log(data)
						uni.showToast({
							title:'发表成功!' 
						})
						let temp = {
							name:that.$store.state.userInfoPlatform.user.userName,
							discuss:that.commentContent
						}
						that.pageDetail.dicusses.push(temp)
						that.commentNum = 999	
						that.commentContent = ''
						if(that.isUnlock === true){
							that.$store.commit('updateUserBeanNum',1)
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 复制到剪贴板
			copyToClipboard: function(link) {
				uni.setClipboardData({
					data: link
				})
			},
			// 切换至编辑页面
			switchToEdit:function(){
				uni.navigateTo({
					url:`../edit/edit?id=${this.pageDetail.interviewexperience.interviewexperienceId}`
				})
			},
			// 获取面经数据
			getPageDetail:function(id){
				let that = this
				this.$axios.request({
					url:`/interview/GetInterviewExperience`,
					method:'get',
					params:{
						id:id,
						isLock:0
					}
				}).then(function({data}){
					console.log(data)
					that.pageDetail = data.data
					that.cutInterviewDetail(data.data.details)
					that.cutCompanyLabel(data.data.interviewexperience.offerAuthentication)
					if(data.data.dicusses.length <= 6){
						that.commentNum = 999
					}
					else{
						that.commentNum = 6
					}
					// 判断类型改变背景logo
					if(data.data.interviewexperience.type === 0){
						that.bgImageSrc = '../../static/pic/fontpage/bg1.svg'
					}
					if(data.data.interviewexperience.type === 1){
						that.bgImageSrc = '../../static/pic/fontpage/bg4.svg'
					}
					if(data.data.interviewexperience.type === 2){
						that.bgImageSrc = '../../static/pic/fontpage/bg3.svg'
					}
					if(data.data.interviewexperience.type === 3){
						that.bgImageSrc = '../../static/pic/fontpage/bg2.svg'
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 切割面经详情
			cutInterviewDetail:function(details){
				console.log(details)
				for(let i = 0;i<details.length;i++){
					if(details[i].type === 0){
						this.linkList.push(details[i])
					}
					if(details[i].type === 1){
						this.fileList.push(details[i])
					}
					if(details[i].type === 2){
						this.imgList.push(this.$store.state.baseUrl + '/file/'+ details[i].link)
					}
				}
			},
			// 切割用户实习标签
			cutCompanyLabel:function(offerList){
				let that = this
				let temp = ''
				if(offerList === null){
					temp = ''
				}
				else{
					temp = offerList.split('/')
				}
				for(let k =0;k<temp.length;k++){
					if(temp[k] === ''){
						temp.splice(k,1)
					}
				}
				console.log(temp)
				for(let j =0;j<temp.length;j++){
					if(temp[j].substring(0,3) === '实习|'){
						this.labelGroup.push({'name':temp[j].substring(3),'isFull':false})
					}
					if(temp[j].substring(0,3) === '全职|'){
						this.labelGroup.push({'name':temp[j].substring(3),'isFull':true})
					}
				}
				uni.getImageInfo({
					src:`${this.baseUrl}/file/${this.pageDetail.interviewexperience.userPot}`,
					success(res) {
						that.avatarUrl = res.path
						that.$nextTick(function(){
							that.sharePicGenerate()
						})
					},
					fail(err) {
						console.log('图片加载失败'+err)
					}
				})
				
			},
			// 分享图片绘制函数
			sharePicGenerate:function(){
				console.log(1)
				var that = this;
				var ctx = uni.createCanvasContext('first',this);
				// 绘制水印
				ctx.beginPath()
				ctx.setGlobalAlpha(0.1)
				if(this.pageDetail.interviewexperience.type === 0){
					ctx.drawImage('../../static/pic/bg/mianjin.png',300,220,220,220)
				}
				if(this.pageDetail.interviewexperience.type === 1){
					ctx.drawImage('../../static/pic/bg/ziliao.png',300,220,220,220)
				}
				if(this.pageDetail.interviewexperience.type === 2){
					ctx.drawImage('../../static/pic/bg/jiangzuo.png',300,220,220,220)
				}
				if(this.pageDetail.interviewexperience.type === 3){
					ctx.drawImage('../../static/pic/bg/geren.png',300,220,220,220)
				}
				ctx.closePath()
				
				// 绘制标题
				ctx.beginPath()
				// 指定字号，颜色，字体粗细
				ctx.setFontSize(39)
				ctx.setGlobalAlpha(1)
				ctx.setFillStyle('#000000')
				ctx.fontWeight = 'bold'
				// 创建标题临时数组
				var titleTemp = []
				var temp=''
				var title = this.pageDetail.interviewexperience.title.split('')
				// 循环遍历，将标题按长度拆分
				for(let i = 0;i<title.length;i++){
					if(ctx.measureText(temp).width<400){
						temp+=title[i]
					}
					else{
						// 减1防止文字丢失
						i = i-1
						titleTemp.push(temp)
						temp = ''
					}
					// 最终将所有文字存入
					if(i === title.length-1){
						titleTemp.push(temp)
					}
				}
				// 最大行数判断，超过2的话，将最后一行替换省略号
				if(titleTemp.length >2 ){
					var secondLine = titleTemp[1].split('')
					var secondTemp = ''
					for(let k = 0;k<secondLine.length;k++){
						if(k < secondLine.length-1){
							secondTemp += secondLine[k]
						}
						else{
							secondTemp += '…'
						}
					}
					// 切片替换
					titleTemp.splice(1,1,secondTemp)
					titleTemp.splice(2,titleTemp.length-2)
				}
				// 循环绘制标题
				for (let j = 0; j<titleTemp.length;j++){
					ctx.fillText(titleTemp[j],30,60+j*60)
				}
				ctx.closePath()
				
				// 开启新路径，绘制简介
				ctx.beginPath()
				ctx.setFontSize(24)
				ctx.setFillStyle('#828282')
				// 简介临时数组
				var infoTemp = []
				// 简介单字符数组
				var infoChartemp = ''
				var content = this.pageDetail.interviewexperience.summary.split('')
				for(let m = 0;m<content.length;m++){
					if(ctx.measureText(infoChartemp).width<416){
						infoChartemp+=content[m]
					}
					else{
						// 减1防止文字丢失
						m = m-1
						infoTemp.push(infoChartemp)
						infoChartemp = ''
					}
					// 最终将所有文字存入
					if(m === content.length-1){
						infoTemp.push(infoChartemp)
					}
				}
				if(infoTemp.length > 3){
					var infoThirdline = infoTemp[2].split('')
					var infoThirdTemp = ''
					for(let k = 0;k<infoThirdline.length;k++){
						if(k < infoThirdline.length-1){
							infoThirdTemp += infoThirdline[k]
						}
						else{
							infoThirdTemp += '…'
						}
					}
					// 切片替换
					infoTemp.splice(2,2,infoThirdTemp)
					infoTemp.splice(3,infoTemp.length-3)
				}
				for (let n = 0; n<infoTemp.length;n++){
					ctx.fillText(infoTemp[n],30,60+titleTemp.length*60 + n*32)
				}
				ctx.closePath()
				// 获取头像信息
				// 绘制头像
				ctx.beginPath()
				ctx.save()
				let x = 30
				let y = 270
				let w = 100
				let h = 100
				ctx.arc(x+w/2, y+h/2, w/2, 0, Math.PI * 2);
				ctx.clip()
				ctx.drawImage(this.avatarUrl,x,y,w,h)
				ctx.restore()
				ctx.closePath()
				
				// 绘制用户名,全部标签情况
				ctx.beginPath()
				ctx.setFontSize(29)
				ctx.setFillStyle('#333333')
				if(this.labelGroup.length === 0){
					ctx.fillText(this.pageDetail.interviewexperience.userName,140,330)
				}
				else{
					ctx.fillText(this.pageDetail.interviewexperience.userName,140,320)
				}
				ctx.closePath()
				
				// 绘制label外框及文字
				ctx.beginPath()
				let fulllength = 0
				let labelGroup = []
				for(let p = 0;p<this.labelGroup.length;p++){
					ctx.save()
					ctx.setFontSize(17)
					let labelwidth = ctx.measureText(this.labelGroup[p].name).width
					if(this.labelGroup[p].isFull === false){
						this.roundRect(ctx,140 + fulllength,330,labelwidth+20,26,8,'#F2C94C')
					}
					else{
						this.roundRect(ctx,140 + fulllength,330,labelwidth+20,26,8,'#00A29A')
					}
					
					ctx.setFillStyle('#FFFFFF')
					ctx.fillText(this.labelGroup[p].name,140 + fulllength+10,349)
					ctx.restore()
					fulllength += labelwidth + 30
				}
				ctx.closePath()
				
			
				// 生成最终绘制图
				ctx.draw(false, () => {
					setTimeout(function() {
						uni.canvasToTempFilePath({
							canvasId: 'first',
							success: (res1) => {
								that.shareImg = res1.tempFilePath
							}
						});
					}, 50);
				});
			},
			// 分享图片中label圆角绘制
			roundRect:function(ctx, x, y, w, h, r,color) {
				// 开始绘制
				ctx.beginPath()
				// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
				// 这里是使用 fill 还是 stroke都可以，二选一即可
				ctx.setFillStyle(color)
				// ctx.setStrokeStyle('transparent')
				// 左上角
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
				// border-top
				ctx.moveTo(x + r, y)
				ctx.lineTo(x + w - r, y)
				ctx.lineTo(x + w, y + r)
				// 右上角
				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
				// border-right
				ctx.lineTo(x + w, y + h - r)
				ctx.lineTo(x + w - r, y + h)
				// 右下角
				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
				// border-bottom
				ctx.lineTo(x + r, y + h)
				ctx.lineTo(x, y + h - r)
				// 左下角
				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
				// border-left
				ctx.lineTo(x, y + r)
				ctx.lineTo(x + r, y)
				// 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
				ctx.fill()
				// ctx.stroke()
				ctx.closePath()
				// 剪切
				ctx.clip()
			},
			// 分享函数
			onShareAppMessage(options) {
				let that = this
				this.sharePicGenerate()
				var shareObj = {
					title:'顶尖高校职场同龄人聚集地',
					path: `/pages/fontpage/fontpage?shareOpenId=${this.$store.state.userOpenID}&sharePostId=${this.pageDetail.interviewexperience.interviewexperienceId}`,
					imageUrl:this.shareImg
				}
				return shareObj;
			},
			// 下载文件函数
			getFile:function(link){
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				wx.downloadFile({
					url: `${this.$store.state.baseUrl}/file/${file.link}`,
					success: function(res) {
						wx.getFileSystemManager().saveFile({
							tempFilePath: res.tempFilePath,
							filePath: `${wx.env.USER_DATA_PATH}/${file.title}`,
							success(res) {
								wx.openDocument({
									filePath: `${wx.env.USER_DATA_PATH}/${file.title}`,
									success(res) {
										uni.hideLoading()
									},
									fail(err){
										uni.hideLoading()
										uni.showToast({
											title: '打开失败',
											icon: 'none'
										})
									}
								})
							},
								
							fail(err){
								uni.hideLoading()
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								})
							}
						})
				
					},
					fail: function(err) {
						uni.hideLoading()
						uni.showToast({
							title: '下载失败!请重试',
							icon: 'none'
						})
					},
				});
			},
			// 评论内容安全校验
			checkCommentSecurity:function(){
				if(this.commentContent.match(/^[ ]*$/)){
					return
				}
				let that = this
				let data = {
					text:this.commentContent
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/wx/checkText`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// 校验通过则发送评论
					that.sendComment()
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onLoad:function(options){
			// 获取个人信息
			console.log(options.id)
			this.userInfo = this.$store.state.userInfoPlatform
			// 获取面经信息
			this.baseUrl = this.$store.state.baseUrl
			this.getPageDetail(options.id)
		}
	}
</script>

<style lang="less" scoped>
	// 标题头部
	.head {
		width: 100%;
		height: 110upx;
		background-color: #f2fafa;
		border-radius: 0 0 20upx 20upx;
		display: flex;
		align-items: center;
		overflow: hidden;
		position: fixed;
		top: 0;
		z-index: 999;

		.title {
			color: #333333;
			font-weight: bold;
			margin-left: 36upx;
		}

		.bg {
			width: 120upx;
			height: 136upx;
			position: absolute;
			opacity: 0.1;
			right: 24upx;
		}
		// 价格标签
		.price-label{
			width: 88upx;
			height: 32upx;
			position: relative;
			margin-left: 12upx;
			display: flex;
			align-items: center;
			.bgimage{
				top:0;
				left: 0;
				position: absolute;
				width: 88upx;
				height: 32upx;
			}
			// 免费
				
			.free{
				margin-left: 10upx;
				color: #FFFFFF;
				font-size: 16upx;
				font-weight: 600;
				z-index: 2;
			}
			// 已解锁
			.has-unlock{
				color: #19AAA3;
			}
			// 价格
			.peers-price{
				height: 32upx;
				display: flex;
				align-items: center;
				z-index: 2;
				margin-left: 10upx;
				.peers{
					width: 26upx;
					height: 20upx;
				}
				.price{
					color: #19AAA3;
					font-size: 16upx;
				}
			}
		}
	}

	// 头部占位块
	.head-placeholder {
		width: 100%;
		height: 110upx;
	}

	// 用户信息
	.user {
		display: flex;
		align-items: center;
		margin: 24upx 36upx;

		// 头像
		.avatar {
			width: 74upx;
			height: 74upx;
			border-radius: 50%;
		}

		// 
		.up {
			display: flex;
			align-items: center;

			text {

				// 昵称
				&:nth-child(1) {
					font-size: 24upx;
					font-weight: bold;
					margin-left: 10upx;
				}

				&:nth-child(n+2) {
					font-size: 16upx;
					background-color: #00A29A;
					padding: 2upx 6upx;
					color: #FFFFFF;
					border-radius: 6upx;
					margin-left: 10upx;
				}
			}
		}

		.down {
			display: flex;
			align-items: center;
			margin-top: 4upx;

			text {
				font-size: 16upx;
				background-color: #F2C94C;
				padding: 2upx 6upx;
				color: #FFFFFF;
				border-radius: 6upx;
				margin-left: 10upx;
			}
			.fulltime{
				background-color: #00a29a;
			}
		}


		// 右边分享按钮
		.share-btn {
			margin-left: auto;
			position: relative;
			// 分享图片
			image{
				width: 38upx;
				height: 38upx;
			}
			// 分享按钮，隐藏
			button{
				width: 38upx;
				height: 38upx;
				position: absolute;
				top: 0;
				left: 0;
				background-color: rgba(0,0,0,0);
				&::after{
					border: none;
				}
			}
		}
	}

	// 面经详情
	.detail {
		margin: 24upx 36upx;
		font-size: 24upx;
		color: #4D4D4D;

		text {
			justify-content: center;
			word-break: break-all;
		}
	}

	// 面经描述
	.describe {
		margin: 0 36upx;
		display: flex;
		// 左边标题块
		.nametitle {
			flex-shrink: 0;
			width: 110upx;

			text {
				font-size: 20upx;
				color: #FFFFFF;
				background-color: #00A29A;
				padding: 4upx 8upx;
				border-radius: 10upx;
			}
		}

		.describe-detail {
			font-size: 24upx;
			color: #4D4D4D;
			text-align: justify;
			word-break: break-all;
		}
	}

	// 相关资料
	.information {
		.information-block {
			margin: 24upx 36upx;
			display: flex;
			.nametitle {
				margin: 0;
				flex-shrink: 0;
				width: 110upx;

				text {
					font-size: 20upx;
					color: #FFFFFF;
					background-color: #00A29A;
					padding: 4upx 8upx;
					border-radius: 10upx;
				}
			}

			// 链接样式
			.link {
				text {
					color: #4D4D4D;
					font-size: 24upx;
					text-align: justify;
					word-break: break-all;
				}

				image {
					transform: translateY(16upx);
					width: 40upx;
					height: 50upx;
				}


				// 复制按钮
				.copy {
					font-size: 24upx;
					color: #00A29A;
					margin-left: 10upx;
				}
				.not-unlock-text{
					font-size: 24upx;
					color: #BDBDBD; 
				}
			}
			.not-unlock-text{
				font-size: 24upx;
				color: #BDBDBD; 
			}
			// 详细描述
			.information-detail {
				font-size: 24upx;
				color: #4D4D4D;
				text-align: justify;
				word-wrap: break-all;
			}
			
			// 复制按钮
			.copy {
				font-size: 24upx;
				color: #00A29A;
				margin-left: 10upx;
			}

			// 未解锁
			.not-unlock {
				display: block;
				transform: translateY(18upx);
				font-size: 24upx;
				color: #BDBDBD;
			}
		}

		// 图片
		.information-pic {
			width: 440upx;
			height: 322upx;
			margin-left: 144upx;
			border-radius: 20upx;
			overflow: hidden;
			position: relative;

			.swiper-style {
				width: 440upx;
				height: 322upx;

				.swiper-pic {
					width: 440upx;
					height: 322upx;
				}
			}

			// 模糊效果
			.swiper-blur {
				filter: blur(4px);
			}

			// 遮罩
			.mask {
				height: 150upx;
				width: 440upx;
				position: absolute;
				bottom: 0;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 143.86%);
				z-index: 1;
				pointer-events: none;
			}

			// 自定义轮播图指示点
			.dot {
				position: absolute;
				z-index: 20;
				bottom: 10px;
				right: 0;
				left: 0;
				z-index: 2;
			}

			// 未解锁时的遮罩
			.not-unlock-picmask {
				width: 440upx;
				height: 322upx;
				border-radius: 20upx !important;
				position: absolute;
				font-size: 20upx;
				text-align: center;
				line-height: 322upx;
				top: 0;
				left: 0;
				color: white;
				background: rgba(0, 0, 0, 0.4);
			}
		}
	}

	// 预览图片
	.preview {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.45);
		z-index: 99999;

		// 图片预览组件
		.swiper-fullscreen {
			width: 562upx;
			height: 843upx;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;

			.swiper {
				width: 562upx;
				height: 843upx;
			}

			.swiper-image {
				width: 562upx;
				height: 843upx;
			}
		}

		// 自定义大轮播图指示点
		.dot-big {
			position: absolute;
			bottom: -20px;
			right: 0;
			left: 0;
		}
	}

	// 评论区
	.comment {

		// 背景
		.comment-bg {
			width: 587upx;
			background-color: #f7f7f7;
			position: relative;
			border-radius: 20upx;
			margin: 32upx 0 10upx 126upx;
			padding: 1px 0;

			// 上方小尖角
			&::before {
				content: "";
				position: absolute;
				left: 40upx;
				top: -12upx;
				width: 30upx;
				height: 30upx;
				background-color: #f7f7f7;
				border-radius: 8upx;
				transform: rotate(45deg);
				z-index: -1;
			}

			// 评论
			.comment-detail {
				margin: 12upx 27upx;
				font-size: 22upx;

				text {
					&:nth-child(1) {
						font-weight: 600;
						color: #00A29A;
					}

					&:nth-child(2) {
						text-align: justify;
					}
				}
			}

			// 查看更多
			.show-more {
				margin: 12upx 27upx;
				display: flex;
				align-items: center;
				vertical-align: middle;

				text {
					font-size: 20upx;
					color: #00A29A;
				}

				image {
					margin-top: 2upx;
					width: 16upx;
					height: 16upx;
					margin-left: 10upx;
				}
			}

			// 添加评论
			.add-comment {
				margin: 12upx 27upx;
				display: flex;
				align-items: center;

				text {
					font-size: 22upx;
					font-weight: 600;
					color: #00A29A;
				}

				input {
					padding: 0 12upx;
					border-radius: 10upx;
					background-color: #FFFFFF;
					height: 45upx;
					font-size: 20upx;
					flex: 1;
				}
			}
			
		}
	}

	// 底部占位
	.block-bottom {
		height: 156upx;
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	// 底部tabbar
	.tabbar {
		position: fixed;
		bottom: 0;
		height: 156upx;
		width: 100%;
		background-color: white;
		border-radius: 10px 10px 0px 0px;
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		// 解锁人数
		.people{
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24upx;
			color: #4F4F4F;
			image{
				width: 50upx;
				height: 40upx;
			}
		}
		button{
			margin-right: 36upx;
			flex: 3;
			flex-shrink: 0;
			border: 2px solid #00A29A;
			color: #00A29A;
			font-size: 36upx;
			height: 100upx;
			width: 374upx;
			border-radius: 20upx;
			background-color: #FFFFFF;
		}
	}
</style>
