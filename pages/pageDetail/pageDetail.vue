<template>
	<view id="informationDetail">
		<!-- 标题头部 -->
		<view class="head">
			<text class="title">{{pageDetail.interviewexperience.title}}</text>
			<!-- 价格标签 -->
			<!-- 未解锁状态 -->
			<view class="price-label" v-if="!isUnlock">
				<!-- 价格不为0 -->
				<image :src="pageDetail.interviewexperience.price !== 0?'../../static/pic/fontpage/price-outline.png':'../../static/pic/fontpage/price-free.png'"
				 mode="" class="bgimage"></image>
				<text class="free" v-if="pageDetail.interviewexperience.price === 0">FREE!</text>
				<!-- 价格为Free -->
				<view class="peers-price" v-if="pageDetail.interviewexperience.price !== 0">
					<image src="../../static/pic/fontpage/logo-small.png" mode="" class="peers"></image>
					<text class="price">x{{pageDetail.interviewexperience.price}}</text>
				</view>
			</view>
			<!-- 解锁后的价格标签 -->
			<view class="price-label" v-if="isUnlock">
				<image src="../../static/pic/fontpage/price-outline.png" mode="" class="bgimage"></image>
				<text class="free has-unlock">已解锁</text>
			</view>
			<!-- 背景图 -->
			<image :src="bgImageSrc" mode="" class="bg"></image>
		</view>
		<!-- 头部占位 -->
		<view class="head-placeholder">

		</view>
		<!-- 用户信息 -->
		<view class="user" @click="switchToOtherUserpage(pageDetail.interviewexperience.openId)">
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

			<!-- 右边三角 -->
			<image src="../../static/pic/detail/triangle.svg" mode="" class="triangle"></image>
		</view>
		<!-- 详情 -->
		<view class="detail">
			<text>{{pageDetail.interviewexperience.summary}}</text>
		</view>

		<!-- 相关资料 -->
		<view class="information">
			<!-- 详细描述 -->
			<view class="information-block" v-if="pageDetail.interviewexperience.text !== '' && pageDetail.interviewexperience.text !== null">
				<view class="nametitle">
					<text>内容详情</text>
				</view>
				<view>
					<!-- 详细描述内容 -->
					<text v-if="isUnlock" class="information-detail">{{pageDetail.interviewexperience.text}}</text>
					<view v-if="!isUnlock">
						<text class="information-detail">
							{{pageDetail.interviewexperience.text | formatUnlockText}}
						</text>
						<text class="not-unlock-text" @click="tabbarBtnClick">（解锁查看剩余70%）</text>
					</view>
					<!-- 未解锁 -->
				</view>
			</view>

			<!-- 相关链接 -->
			<view class="information-block" v-if="linkList.length !== 0">
				<view class="nametitle">
					<text>相关链接</text>
				</view>
				<view style="transform: translateY(-12upx);">
					<view class="link" v-if="isUnlock" v-for="(item,i) in linkList" :key="i">
						<image src="../../static/pic/detail/link.svg" mode=""></image>
						<text>{{item.link}}</text>
						<text class="copy" @click="copyToClipboard(item.link)">复制</text>

					</view>
					<!-- 未解锁 -->
					<text class="not-unlock" v-if="!isUnlock" @click="tabbarBtnClick">解锁查看相关链接（{{linkList.length}}个）</text>
				</view>
			</view>
			<!-- 相关文件 -->
			<view class="information-block" v-if="fileList.length !== 0">
				<view class="nametitle">
					<text>相关文件</text>
				</view>
				<view style="transform: translateY(-12upx);">
					<view class="link" @click="getFile(item)" v-for="(item,i) in fileList" :key="i">
						<image src="../../static/pic/detail/file.svg" mode=""></image>
						<text>{{item.title}}</text>
						<text class="not-unlock-text" v-if="!isUnlock" @click="tabbarBtnClick">（解锁查看）</text>

					</view>

				</view>
			</view>

			<!-- 图片 -->
			<view class="information-pic" v-if="imgList.length !== 0">
				<swiper :autoplay="isUnlock" :interval="2000" :duration="1000" class="swiper-style" @change="smallPicChange" :class="isUnlock?'':'swiper-blur'">
					<swiper-item v-for="(item, i) in imgList" :key="i" @click="picPreview(i)">
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
				<!-- 未解锁遮罩 -->
				<view class="not-unlock-picmask" v-if="!isUnlock">
					<text style="z-index: 3;">解锁后即可查看</text>
				</view>
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comment">
			<!-- 聊天框背景 -->
			<view class="comment-bg">
				<!-- 评论区 -->
				<view class="comment-detail" v-for="(item,i) in pageDetail.dicusses" :key="i" v-if="i < commentNum">
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
			<button @click="tabbarBtnClick">
				<view class="lock" v-if="!isUnlock">
					立即解锁
					<view v-if="pageDetail.interviewexperience.price !== 0" style="display: flex;align-items: center;">
						<image src="../../static/pic/detail/peers.png" mode=""></image>×{{pageDetail.interviewexperience.price}}
					</view>
					<view v-if="pageDetail.interviewexperience.price === 0" style="margin-left: 10upx;">
						FREE!
					</view>
				</view>
				<view v-if="isUnlock">
					查看更多干货
				</view>
			</button>
			<!-- 分享与点赞（收藏） -->
			<view class="share-btn">
				<button type="default" open-type="share"></button>
				<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
			</view>
			<!-- 收藏 -->
			<image :src="isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'" mode=""
			 @click="collectCilck(pageDetail.interviewexperience.interviewexperienceId,pageDetail.interviewexperience.title,pageDetail.interviewexperience.openId,pageDetail.interviewexperience.type,pageDetail.interviewexperience.userPot)"></image>
		</view>
		<!-- 绘制分享图 -->
		<view style="position: absolute;top: -999999px;">
			<!-- canvas大小500*400 -->
			<view>
				<canvas style="width: 500px; height: 400px;" canvas-id="first" id="first"></canvas>
			</view>
		</view>
		<!-- 豆子不够弹出层 -->
		<uni-popup-sp type="center" ref="noticepopup">
			<view class="peer-notice">
				<view class="title">
					哎哟，豆子不够了
				</view>
				<!-- 豆子数 -->
				<view class="peers">
					剩余<image src="../../static/pic/fontpage/logo-small.png" mode=""></image>x{{userInfo.user.bean}}
				</view>
				<view class="notice">
					<text @click="switchToMypeer">每一个新好友通过分享登入，你将获得5颗豆子，<text class="more">点击查看更多赚豆子方式</text> </text>
				</view>
				<view class="share-btn">
					<button type="default" open-type="share">去分享得豆子</button>
				</view>
			</view>
		</uni-popup-sp>
		<!-- 下载进度弹窗 -->
		<!-- 上传弹窗 -->
		<uni-popup-sp ref="percentPopup" type="center" :maskClick="false">
			<view class="percent-popup">
				<view class="percent-center">
				<cCircle  :size="50" :percent="downloadProgress" :circleWidth="3" circleColor="#00A29A" :direction = "180" defaultColor="#F2F2F2">
					<span slot="content">{{downloadProgress}}%</span>
				</cCircle>
				<text class="percent-word">下载中</text>
				</view>
			</view>
		</uni-popup-sp>
	</view>
</template>

<script>
	import swiperDot from '@/components/swiper-dot/swiper-dot.vue'
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	import cCircle from "../../components/Your_Exios-Circle/Your_Exios-Circle.vue"
	export default {
		components: {
			swiperDot,
			uniPopupSp,
			cCircle
		},
		data() {
			return {
				// 图片列表
				picList: ['/static/pic/fontpage/advertisement.png', '/static/pic/detail/infopic-big.png'],
				// 小轮播图点
				current: 0,
				// 评论列表
				commentList: [],
				// 测试用
				tempTest: true,
				// 评论用户名
				commentUsername: '',
				commentContent: '',
				// 是否解锁
				isUnlock: false,
				// 页面详情
				pageDetail: {},
				// 基地址
				baseUrl: '',
				// 用户信息
				userInfo: {},
				// 是否收藏了
				isCollect: false,
				// 分享图片
				shareImg: '',
				// 用户label
				labelGroup: [],
				// 用户头像的网络地址
				avatarUrl: '',
				// 面经/资料等type logo
				bgImageSrc: '',
				// 三个内容list
				linkList: [],
				fileList: [],
				imgList: [],
				commentNum: 0,
				// 下载进度
				downloadProgress:0,
			}
		},
		methods: {
			// 
			smallPicChange: function(e) {
				this.current = e.detail.current;
			},
			// 预览图片
			picPreview: function(i) {
				uni.previewImage({
					current: i,
					urls: this.imgList
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
				if (this.isUnlock === true) {
					unlock = 1
				}
				if (this.commentContent.match(/^[ ]*$/)) {
					return
				} else {
					let data = {
						id: this.pageDetail.interviewexperience.interviewexperienceId,
						openid: this.$store.state.userOpenID,
						discuss: this.commentContent,
						name: this.$store.state.userInfoPlatform.user.userName,
						unlock: unlock
					}
					data = this.$qs.stringify(data)
					this.$axios.request({
						url: `/interview/updateDicuss`,
						method: 'post',
						data
					}).then(function({
						data
					}) {
						console.log(data)
						uni.showToast({
							title: '发表成功!'
						})
						let temp = {
							name: that.$store.state.userInfoPlatform.user.userName,
							discuss: that.commentContent
						}
						that.pageDetail.dicusses.push(temp)
						that.commentNum = 999
						that.commentContent = ''
						if (that.isUnlock === true) {
							that.$store.commit('updateUserBeanNum', 1)
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
			// 底部按钮点击事件
			tabbarBtnClick: function() {

				if (this.isUnlock === false) {
					if (this.pageDetail.interviewexperience.price > this.userInfo.user.bean) {
						this.$refs.noticepopup.open()
					} else {
						this.unlockInterview()
					}
				} else {
					uni.switchTab({
						url: '../fontpage/fontpage'
					})
				}
			},
			// 解锁面经
			unlockInterview: function() {
				let that = this
				let data = {
					postId: this.pageDetail.interviewexperience.interviewexperienceId,
					openid: this.userInfo.user.openId,
					title: this.pageDetail.interviewexperience.title,
					postPhoto: this.pageDetail.interviewexperience.userPot,
					issueId: this.pageDetail.interviewexperience.openId,
					type: this.pageDetail.interviewexperience.type,
					price: this.pageDetail.interviewexperience.price
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url: `/Message/insertUserUnlock`,
					method: 'post',
					data
				}).then(function({
					data
				}) {
					console.log(data)
					if (that.pageDetail.interviewexperience.price !== 0) {
						uni.showToast({
							title: '解锁成功！'
						})
					}

					that.isUnlock = true
					// 更新主页的临时状态
					that.$store.commit('updateTempUnlock', true)
					// 更新用户解锁数量
					that.$store.commit('updateUserUnlockNum', 1)
					// 更新用户的豆子数量
					that.$store.commit('updateUserBeanNum', -that.pageDetail.interviewexperience.price)
					// 同步解锁列表
					that.refreshUnlockList()
				}).catch(err => {
					console.log(err)
				})
			},
			// 头部切换其他用户页面
			switchToOtherUserpage: function(openId) {
				uni.navigateTo({
					url: '../otherProfile/otherProfile?openId=' + openId
				})
			},

			// 获取面经数据
			getPageDetail: function(id) {
				let that = this
				this.$axios.request({
					url: `/interview/GetInterviewExperience`,
					method: 'get',
					params: {
						id: id,
						isLock: 0
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.pageDetail = data.data
					// 判断类型改变背景logo
					if (data.data.interviewexperience.type === 0) {
						that.bgImageSrc = '../../static/pic/fontpage/bg1.svg'
					}
					if (data.data.interviewexperience.type === 1) {
						that.bgImageSrc = '../../static/pic/fontpage/bg4.svg'
					}
					if (data.data.interviewexperience.type === 2) {
						that.bgImageSrc = '../../static/pic/fontpage/bg3.svg'
					}
					if (data.data.interviewexperience.type === 3) {
						that.bgImageSrc = '../../static/pic/fontpage/bg2.svg'
					}
					// 评论
					if (data.data.dicusses.length <= 6) {
						that.commentNum = 999
					} else {
						that.commentNum = 6
					}
					// 价格为0时直接解锁
					that.$nextTick(function() {
						if (data.data.interviewexperience.price === 0 && that.isUnlock === false) {
							that.unlockInterview()
						}
					})
					that.cutInterviewDetail(data.data.details)
					// 切割个人标签
					that.cutCompanyLabel(data.data.interviewexperience.offerAuthentication)
				}).catch(err => {
					console.log(err)
				})
			},

			// 获取用户的收藏列表，判断是否收藏
			getUserCollectList: function(id) {
				console.log(this.$store.state.collectList)
				if (this.$store.state.collectList !== '') {
					let colList = this.$store.state.collectList
					for (let i = 0; i < colList.length; i++) {
						if (id == colList[i].postId) {
							this.isCollect = true
							return
						}
					}
				} else {
					let that = this
					this.$axios.request({
						url: `/Message/collection`,
						method: 'get',
						params: {
							openid: that.$store.state.userOpenID
						}
					}).then(function({
						data
					}) {
						console.log(data)
						for (let i = 0; i < data.data.length; i++) {
							if (id == data.data[i].postId) {
								that.isCollect = true
								return
							}
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 刷新收藏列表
			refreshCollectList: function() {
				let that = this
				this.$axios.request({
					url: `/Message/collection`,
					method: 'get',
					params: {
						openid: that.$store.state.userOpenID
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.$store.commit('updateCollectList', data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 刷新解锁列表
			refreshUnlockList: function() {
				let that = this
				this.$axios.request({
					url: `/Message/unlock`,
					method: 'get',
					params: {
						openid: this.$store.state.userOpenID,
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.$store.commit('updateUnlockList', data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 收藏点击函数
			collectCilck: function(id, title, issueId, type, avatar) {
				let that = this
				if (that.isCollect === false) {
					let data = {
						postId: id,
						openid: that.$store.state.userOpenID,
						title: title,
						postPhoto: avatar,
						issueId: issueId,
						type: type
					}
					this.$axios.request({
						url: `/Message/insertUserCollection`,
						method: 'post',
						data
					}).then(function({
						data
					}) {
						console.log(data)
						that.isCollect = true
						that.$store.commit('updateTempCollect', true)
						that.$store.commit('updateTempCollectNum', 1)
						that.$store.commit('updateUserCollectNum', 1)
						that.refreshCollectList()
					}).catch(err => {
						console.log(err)
					})
				}
				// 已收藏时，取消收藏
				else {
					this.$axios.request({
						url: `/Message/DeleteUserCollection`,
						method: 'get',
						params: {
							openid: this.$store.state.userOpenID,
							postId: id
						}
					}).then(function({
						data
					}) {
						console.log(data)
						that.isCollect = false
						that.$store.commit('updateTempCollect', false)
						that.$store.commit('updateTempCollectNum', -1)
						that.$store.commit('updateUserCollectNum', -1)
						that.refreshCollectList()
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 切割面经详情
			cutInterviewDetail: function(details) {
				for (let i = 0; i < details.length; i++) {
					if (details[i].type === 0) {
						this.linkList.push(details[i])
					}
					if (details[i].type === 1) {
						this.fileList.push(details[i])
					}
					if (details[i].type === 2) {
						this.imgList.push(this.$store.state.baseUrl + '/file/' + details[i].link)
					}
				}
			},
			// 分享图片绘制函数
			sharePicGenerate: function() {
				console.log(1)
				var that = this;
				var ctx = uni.createCanvasContext('first', this);
				// 绘制水印
				ctx.beginPath()
				ctx.setGlobalAlpha(0.1)
				if (this.pageDetail.interviewexperience.type === 0) {
					ctx.drawImage('../../static/pic/bg/mianjin.png', 300, 220, 220, 220)
				}
				if (this.pageDetail.interviewexperience.type === 1) {
					ctx.drawImage('../../static/pic/bg/ziliao.png', 300, 220, 220, 220)
				}
				if (this.pageDetail.interviewexperience.type === 2) {
					ctx.drawImage('../../static/pic/bg/jiangzuo.png', 300, 220, 220, 220)
				}
				if (this.pageDetail.interviewexperience.type === 3) {
					ctx.drawImage('../../static/pic/bg/geren.png', 300, 220, 220, 220)
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
				var temp = ''
				var title = this.pageDetail.interviewexperience.title.split('')
				// 循环遍历，将标题按长度拆分
				for (let i = 0; i < title.length; i++) {
					if (ctx.measureText(temp).width < 400) {
						temp += title[i]
					} else {
						// 减1防止文字丢失
						i = i - 1
						titleTemp.push(temp)
						temp = ''
					}
					// 最终将所有文字存入
					if (i === title.length - 1) {
						titleTemp.push(temp)
					}
				}
				// 最大行数判断，超过2的话，将最后一行替换省略号
				if (titleTemp.length > 2) {
					var secondLine = titleTemp[1].split('')
					var secondTemp = ''
					for (let k = 0; k < secondLine.length; k++) {
						if (k < secondLine.length - 1) {
							secondTemp += secondLine[k]
						} else {
							secondTemp += '…'
						}
					}
					// 切片替换
					titleTemp.splice(1, 1, secondTemp)
					titleTemp.splice(2, titleTemp.length - 2)
				}
				// 循环绘制标题
				for (let j = 0; j < titleTemp.length; j++) {
					ctx.fillText(titleTemp[j], 30, 60 + j * 60)
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
				for (let m = 0; m < content.length; m++) {
					if (ctx.measureText(infoChartemp).width < 416) {
						infoChartemp += content[m]
					} else {
						// 减1防止文字丢失
						m = m - 1
						infoTemp.push(infoChartemp)
						infoChartemp = ''
					}
					// 最终将所有文字存入
					if (m === content.length - 1) {
						infoTemp.push(infoChartemp)
					}
				}
				if (infoTemp.length > 3) {
					var infoThirdline = infoTemp[2].split('')
					var infoThirdTemp = ''
					for (let k = 0; k < infoThirdline.length; k++) {
						if (k < infoThirdline.length - 1) {
							infoThirdTemp += infoThirdline[k]
						} else {
							infoThirdTemp += '…'
						}
					}
					// 切片替换
					infoTemp.splice(2, 2, infoThirdTemp)
					infoTemp.splice(3, infoTemp.length - 3)
				}
				for (let n = 0; n < infoTemp.length; n++) {
					ctx.fillText(infoTemp[n], 30, 60 + titleTemp.length * 60 + n * 32)
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
				ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
				ctx.clip()
				ctx.drawImage(this.avatarUrl, x, y, w, h)
				ctx.restore()
				ctx.closePath()

				// 绘制用户名,全部标签情况
				ctx.beginPath()
				ctx.setFontSize(29)
				ctx.setFillStyle('#333333')
				if (this.labelGroup.length === 0) {
					ctx.fillText(this.pageDetail.interviewexperience.userName, 140, 330)
				} else {
					ctx.fillText(this.pageDetail.interviewexperience.userName, 140, 320)
				}
				ctx.closePath()

				// 绘制label外框及文字
				ctx.beginPath()
				let fulllength = 0
				for (let p = 0; p < this.labelGroup.length; p++) {
					ctx.save()
					ctx.setFontSize(17)
					let labelwidth = ctx.measureText(this.labelGroup[p].name).width
					if (this.labelGroup[p].isFull === false) {
						this.roundRect(ctx, 140 + fulllength, 330, labelwidth + 20, 26, 8, '#F2C94C')
					} else {
						this.roundRect(ctx, 140 + fulllength, 330, labelwidth + 20, 26, 8, '#00A29A')
					}

					ctx.setFillStyle('#FFFFFF')
					ctx.fillText(this.labelGroup[p].name, 140 + fulllength + 10, 349)
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
			roundRect: function(ctx, x, y, w, h, r, color) {
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
					title: '顶尖高校职场同龄人聚集地',
					path: `/pages/fontpage/fontpage?shareOpenId=${this.$store.state.userOpenID}&sharePostId=${this.pageDetail.interviewexperience.interviewexperienceId}`,
					imageUrl: this.shareImg
				}
				return shareObj;
			},
			// 切割用户实习标签
			cutCompanyLabel: function(offerList) {
				let that = this
				let temp = ''
				if (offerList === null) {
					temp = ''
				} else {
					temp = offerList.split('/')
				}
				for (let k = 0; k < temp.length; k++) {
					if (temp[k] === '') {
						temp.splice(k, 1)
					}
				}
				for (let j = 0; j < temp.length; j++) {
					if (temp[j].substring(0, 3) === '实习|') {
						this.labelGroup.push({
							'name': temp[j].substring(3),
							'isFull': false
						})
					}
					if (temp[j].substring(0, 3) === '全职|') {
						this.labelGroup.push({
							'name': temp[j].substring(3),
							'isFull': true
						})
					}
				}
				uni.getImageInfo({
					src: `${that.baseUrl}/file/${that.pageDetail.interviewexperience.userPot}`,
					success(res) {
						that.avatarUrl = res.path
						that.sharePicGenerate()
					}
				})
			},
			// 切换到我的豆子
			switchToMypeer: function() {
				uni.navigateTo({
					url: '../myPeers/myPeers'
				})
			},
			// 获得用户解锁列表
			getUserUnlockList: function(id) {
				if (this.$store.state.unlockList !== '') {
					let unlockList = this.$store.state.unlockList
					for (let i = 0; i < unlockList.length; i++) {
						if (id == unlockList[i].postId) {
							this.isUnlock = true
							return
						}
					}
				} else {
					let that = this
					this.$axios.request({
						url: `/Message/unlock`,
						method: 'get',
						params: {
							openid: this.$store.state.userOpenID,
						}
					}).then(function({
						data
					}) {
						console.log(data)
						that.$store.commit('updateUnlockList', data.data)
						for (let i = 0; i < data.data.length; i++) {
							if (id == data.data[i].postId) {
								that.isUnlock = true
								return
							}
						}
					}).catch(err => {
						console.log(err)
					})
				}

			},
			// 下载文件函数,纯微信写法，为了能保存文件名
			getFile: function(file) {
				let that = this
				if (!this.isUnlock) {
					uni.showToast({
						title: '解锁后即可下载查看!',
						icon: 'none'
					})
					return
				} else {
					this.$refs.percentPopup.open()
					let downProgress = wx.downloadFile({
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
					downProgress.onProgressUpdate(function(res){
						that.downloadProgress = res.progress
						if(res.progress === 100){
							that.$refs.percentPopup.close()
						}
					})
				}
			},
			// 评论内容安全校验
			checkCommentSecurity: function() {
				if (this.commentContent.match(/^[ ]*$/)) {
					return
				}
				let that = this
				let data = {
					text: this.commentContent
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url: `/wx/checkText`,
					method: 'post',
					data
				}).then(function({
					data
				}) {
					console.log(data)
					// 校验通过则发送评论
					that.sendComment()
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 生命周期函数
		onLoad: function(options, query) {
			console.log(options.id)
			// if(query.scene === undefined){
			// 	console.log('scene不存在')

			// }else{
			// 	let scene = decodeURIComponent(query.scene)
			// 	console.log(query.scene)
			// }
			// 获取面经信息
			this.getPageDetail(options.id)
			// 获取个人信息
			this.userInfo = this.$store.state.userInfoPlatform
			// 获取收藏列表，比较用户是否收藏
			this.getUserCollectList(options.id)
			// 获取解锁列表，比较用户是否解锁
			this.getUserUnlockList(options.id)
			// 基础地址
			this.baseUrl = this.$store.state.baseUrl
		},
		filters: {
			formatUnlockText(msg) {
				return msg.substring(0, msg.length * 0.3);
			}
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
		z-index: 9;

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
		.price-label {
			width: 88upx;
			height: 32upx;
			position: relative;
			margin-left: 12upx;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			margin-right: 36upx;

			.bgimage {
				top: 0;
				left: 0;
				position: absolute;
				width: 88upx;
				height: 32upx;
			}

			// 免费

			.free {
				margin-left: 10upx;
				color: #FFFFFF;
				font-size: 16upx;
				font-weight: 600;
				z-index: 2;
			}

			// 已解锁
			.has-unlock {
				color: #19AAA3;
			}

			// 价格
			.peers-price {
				height: 32upx;
				display: flex;
				align-items: center;
				z-index: 2;
				margin-left: 10upx;

				.peers {
					width: 26upx;
					height: 20upx;
				}

				.price {
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

		// 昵称
		.up {
			display: flex;
			align-items: center;
			font-size: 24upx;
			font-weight: bold;
			margin-left: 10upx;
		}

		// 简历标签
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

			.fulltime {
				background-color: #00a29a;
			}
		}


		// 小三角
		.triangle {
			width: 16.5upx;
			height: 25.6upx;
			margin-left: auto;
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

				.not-unlock-text {
					font-size: 24upx;
					color: #BDBDBD;
				}
			}

			.not-unlock-text {
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

			// 未解锁时，折叠
			.unlock-text-style {
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
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
				border-radius: 20upx;
				position: absolute;
				font-size: 20upx;
				text-align: center;
				line-height: 322upx;
				top: 0;
				left: 0;
				color: white;
				background: rgba(0, 0, 0, 0.4);
				overflow: hidden;
				backface-visibility: hidden;
				transform: translate3d(0, 0, 0);
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
		z-index: 99;
		display: flex;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		button {
			width: 504upx;
			height: 98upx;
			background-color: #00A29A;
			color: #FFFFFF;
			float: left;
			font-size: 36upx;
			border-radius: 20upx;
			display: flex;
			align-items: center;
			justify-content: center;

			// 上锁button状态
			.lock {
				display: flex;
				align-items: center;

				image {
					width: 50upx;
					height: 36upx;
					margin: 0 5upx;
				}
			}
		}

		// 底部分享按钮
		.share-btn {
			float: left;
			width: 54upx;
			height: 48upx;
			margin-right: 36upx;
			position: relative;

			button {
				position: absolute;
				top: 0;
				left: 0;
				background-color: rgba(0, 0, 0, 0);
				width: 54upx;
				height: 48upx;

				&::after {
					border: none;
				}
			}

			image {
				width: 54upx;
				height: 48upx;
			}
		}

		// 收藏按钮（爱心）
		image {
			float: left;
			width: 54upx;
			height: 48upx;
			margin-right: 36upx;
		}
	}

	// 豆子不够弹出样式
	.peer-notice {
		overflow: hidden;
		background-color: #FFFFFF;
		width: 446upx;
		border-radius: 20upx;
		text-align: center;

		// 标题
		.title {
			color: #4F4F4F;
			font-size: 36upx;
			margin-top: 52upx;
			display: flex;
			justify-content: center;
		}

		// 豆子数
		.peers {
			margin-top: 38upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #4F4F4F;
			font-size: 28upx;

			image {
				width: 44upx;
				height: 34upx;
			}
		}

		.notice {
			margin: 46upx 30upx 0 30upx;
			color: #828282;
			font-size: 20upx;

			text {

				.more {
					color: #00a29a;
				}
			}
		}

		// 分享按钮
		.share-btn {
			margin: 12upx 30upx 30upx 30upx;

			button {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 78upx;
				background-color: #00a29a;
				color: #FFFFFF;
				font-size: 28upx;
				font-weight: 500;
				border-radius: 20upx;
			}
		}
	}
	
	// 上传进度弹窗
	.percent-popup{
		width: 120px;
		height: 120px;
		background-color: #FFFFFF;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		.percent-center{
			display: flex;
			align-items: center;
			flex-direction: column;
			.percent-word{
				font-size: 13px;
				color: #333333;
				margin-top: 10px;
			}
		}
	}
</style>
