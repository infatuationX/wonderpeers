<template>
	<view id="publishDetail">
		<!-- 标题 -->
		<view class="editTitle">
			<view>
				<text>*</text>
				<text>标题</text>
			</view>
			<input type="text" value="" v-model="title"/>
		</view>
		<!-- 简介 -->
		<view class="info">
			<view>
				<text class="info-title">摘要</text>
			</view>
			<view style="height: 144upx;"> 
				<textarea value="" maxlength="100" v-model="info" placeholder="请在此对内容题纲，亮点等进行描述，将在首页展示" @input="infoTextareaListen" />
				<view class="num">
					<text>{{infoTextareaNum}}</text>/100
				</view>
			</view>
			
		</view>
		<!-- 详情 -->
		<view class="detail">
			<view class="detail-title">
				<text>*</text>
				<text>内容详情</text>
			</view>
			<view class="addText">
				<textarea value="" maxlength="1000" v-model="detailtext" placeholder="请在此写下相关的详细内容，用户解锁后才可完整查看" @input="detailTextareaListen" />
				<view class="num">
					<text>{{detailTextareaNum}}</text>/1000
				</view>
			</view>
			<view class="append-title">
				<text>附件</text>
				<view @click="closeFisrtPicAsCover">
					将图片作为封面
					<image :src="isFirstPicAsCover?'../../static/pic/detail/open.svg':'../../static/pic/detail/close.svg'" mode="" ></image>
				</view>
			</view>
			<!-- 链接 -->
			<view class="link" v-for="(item,i) in originLinkList" :key="i">
				<image src="../../static/pic/detail/link.svg" mode=""></image>
			
					<text>{{item.link}}</text>
					<image src="../../static/pic/me/x.svg" mode="" class="closeImg" @click="deleteLinkOrigin(i)"></image>
				
			</view>
			<view class="link" v-for="(item,i) in linkList" :key="i">
				<image src="../../static/pic/detail/link.svg" mode=""></image>

					<text>{{item}}</text>
					<image src="../../static/pic/me/x.svg" mode="" class="closeImg" @click="deleteLink(i)"></image>
				
			</view>
			<!-- 原文件 -->
			<view class="link" v-for="(item,i) in originFileList" :key="i">
				<image src="../../static/pic/detail/file.svg" mode=""></image>
					<text>{{item.title}}</text>
					<image src="../../static/pic/me/x.svg" mode="" class="closeImg" @click="deleteFileOrigin(i)"></image>
				
			</view>
			
			<!-- 文件 -->
			<view class="link" v-for="(item,i) in fileList" :key="i">
				<image src="../../static/pic/detail/file.svg" mode=""></image>
					<text>{{item.name}}</text>
					<image src="../../static/pic/me/x.svg" mode="" class="closeImg" @click="deleteFile(i)"></image>
				
			</view>
			<!-- 原图片 -->
			<view class="editPic">
				<!-- 原图片 -->
				<view v-for="(item,i) in originImageList" :key = "i" class="preImage" @click="previewImg(i)">
					<image :src="`${baseUrl}/file/${item.link}`" mode="aspectFill" class="smallpic"></image>
					<!-- 删除按钮 -->
					<image src="../../static/pic/me/x.svg" mode="" class="closePicImg" @click.stop="deletePicOrigin(i)"></image>
				</view>
				<!-- 新图片 -->
				<view v-for="(item,i) in imglist" :key = "i" class="preImage" @click="previewImg(i+originImageList.length)">
					<image :src="item" mode="aspectFill" class="smallpic"></image>
					<!-- 删除按钮 -->
					<image src="../../static/pic/me/x.svg" mode="" class="closePicImg" @click.stop="deletePic(i)"></image>
				</view>
			</view>
			<view style="clear: both;">
				
			</view>
			<!-- 添加链接 -->
			<view class="addLink" v-if="isLinkSelect">
				<input type="text" placeholder="粘贴链接"  @confirm="addLink" confirm-type="done" v-model="linktext" @blur = "listenLinktext" auto-focus adjust-position/>
			</view>
			<view class="addDetail" @click="selectDetailItem">
				<view style="text-align: center;">
					<image src="../../static/pic/me/add-slim.svg" mode=""></image>
					<text>图片，微信文件，链接</text>
				</view>
			</view>
		</view>
		<!-- 行业标签 -->
		<view class="industry">
			<view>
				<text>*</text>
				<text>行业</text>
				<text>（可多选）</text>
			</view>
			<view class="industry-label">
					<text v-for="(item,i) in industry" :key = "i" @click="labelClick(i)" :class="{labelSelect:industryJudge[i]}">{{item}}</text>
			</view>
		</view>
		<!-- 解锁条件 -->
		<view class="condition">
			<view>
				<text>*</text>
				<text>解锁条件</text>
			</view>
			<view style="display: flex;">
				<!-- 选项一 -->
				<view class="radio1"  @click="radioChange(1)">
					<view class="okWhite" v-if="!radio1Select">
						<image src="../../static/pic/me/ok.svg" mode="" ></image>
					</view>
					<view class="okGreen" v-if="radio1Select">
						<image src="../../static/pic/me/ok-white.svg" mode="" ></image>
					</view>
					<text>免费获取</text>
				</view>
				<!-- 选项二 -->
				<view class="radio2" @click="radioChange(2)">
					<view class="okWhite" v-if="!radio2Select" >
						<image src="../../static/pic/me/ok.svg" mode="" ></image>
					</view>
					<view class="okGreen" v-if="radio2Select">
						<image src="../../static/pic/me/ok-white.svg" mode="" ></image>
					</view>
					<image src="../../static/pic/fontpage/logo.svg" mode="" class="peers"></image>
					<text>x</text>
					<!-- 豆子选择器 -->
					<view style="margin-left: 10upx;">
						<picker mode="selector" :range="peerRange" :value="peerIndex" class="picker-style" @change="peerChange">
							<view>{{peerRange[peerIndex]}}</view>
						</picker>
					</view>				
				</view>				
			</view>
		</view>
		<!-- 占位 -->
		<view style="height: 162upx;padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);">
		</view>
		<!-- 底部固定按钮 -->
		<view class="bottom-btn">
			<button open-type="contact">联系客服</button>
			<button @click="confirmPublish">确认</button>
		</view>
		<!-- 图片加水印，最多九张图片，九个canvas -->
		<view style="position: absolute;top: -999999px;">
			<view>
				<canvas :style="{'width':w,'height': h}" canvas-id="first"></canvas>
				<canvas :style="{'width':w2,'height': h2}" canvas-id="second"></canvas>
				<canvas :style="{'width':w3,'height': h3}" canvas-id="third"></canvas>
				<canvas :style="{'width':w4,'height': h4}" canvas-id="fourth"></canvas>
				<canvas :style="{'width':w5,'height': h5}" canvas-id="fifth"></canvas>
				<canvas :style="{'width':w6,'height': h6}" canvas-id="sixth"></canvas>
				<canvas :style="{'width':w7,'height': h7}" canvas-id="seventh"></canvas>
				<canvas :style="{'width':w8,'height': h8}" canvas-id="eighth"></canvas>
				<canvas :style="{'width':w9,'height': h9}" canvas-id="ninth"></canvas>
			</view>
		</view>
		<!-- 上传弹窗 -->
		<uni-popup-sp ref="percentPopup" type="center" :maskClick="false">
			<view class="percent-popup">
				<view class="percent-center">
				<cCircle  :size="50" :percent="percent" :circleWidth="3" circleColor="#00A29A" :direction = "180" defaultColor="#F2F2F2">
					<span slot="content">{{percent}}%</span>
				</cCircle>
				<text class="percent-word">上传中</text>
				</view>
			</view>
		</uni-popup-sp>
	</view>
</template> 

<script> 
	import cCircle from "../../components/Your_Exios-Circle/Your_Exios-Circle.vue"
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	export default {
		components:{
			cCircle,uniPopupSp
		},
		data() {
			return {
				isUploadSuccess:false,
				// 封面的临时路径
				coverPath:'',
				// 标题
				title:'',
				// 宣传简介及简介字数
				info:'',
				infoTextareaNum:0,
				// 详情及详情字数
				detailtext:'',
				detailTextareaNum:0,
				// 四个选项控制值
				isTextSelect:false,
				isFileSelect:false,
				isPicSelect:false,
				isLinkSelect:false,
				// 文件、链接、图片三个列表
				fileList:[],
				linkList:[],
				imglist:[],
				linktext:'',
				// 行业标签
				industry:['互联网','金融','咨询','快消','其他'],
				// 判断行业哪个被选中了
				industryJudge:[false,false,false,false,false],
				// 豆子数量
				peerRange:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				peerIndex:0,
				// 1代表免费，2代表付费
				radio1Select:true,
				radio2Select:false,
				// 九个canvas宽高
				w: '',
				h: '',
				w2: '',
				h2: '',
				w3: '',
				h3: '',
				w4: '',
				h4: '',
				w5: '',
				h5: '',
				w6: '',
				h6: '',
				w7: '',
				h7: '',
				w8: '',
				h8: '',
				w9: '',
				h9: '',
				// 类型
				type:'',
				// 临时封面路径
				tempCoverPath:'',
				// 临时上传图片数组
				tempUploadImagePath:[],
				// 临时文件数组
				tempFilePathList:[],
				// 编辑前的原文件,原图片
				originFileList:[],
				originImageList:[],
				originLinkList:[],
				// 原始面经数据
				pageDetail:{},
				// 请求基础地址
				baseUrl:'',
				// 将图片作为封面
				isFirstPicAsCover:true,
				// 进度条的百分比
				percent:0,
				// 文件的全部size
				fullSize:0,
				// 已经上传的size
				uploadSize:0,
				// 新增图片大小数组
				imgSizeList:[]
			}
		},
		methods: {
			// 监听宣传简介textarea输入，更新字数显示
			infoTextareaListen:function(){
				this.infoTextareaNum = this.info.length
			},
			// 上传具体内容选项
			selectDetailItem:function(){
				let that = this
				uni.showActionSheet({
					itemList:['图片','微信文件','链接'],
					success(res) {
						console.log(res.tapIndex)
						// 第一项 上传图片
						if(res.tapIndex === 0){
							that.takePhoto()
						}
						// 第二项 上传文件
						if(res.tapIndex === 1){
							uni.chooseMessageFile({
								count: 9,
								type:'file',
								success(res){
									console.log(res)
									that.fileList.push(...res.tempFiles)
									res.tempFiles.forEach((item)=>{
										that.fullSize += item.size 
									})
								}
							})
						}
						// 第三项 上传链接
						if(res.tapIndex === 2){
							that.isLinkSelect = true
						}
					}
				})
			},
			// 监听文本框
			detailTextareaListen:function(){
				this.detailTextareaNum = this.detailtext.length
			},
			// 添加链接
			addLink:function(){
				if(this.linktext.match(/^[ ]*$/)){
					return
				}
				else{
					this.linkList.push(this.linktext)
					this.linktext = ''
				}
			},
			// 监听链接文本框
			listenLinktext:function(){
				if(this.linktext.match(/^[ ]*$/)){
					this.isLinkSelect = false
				}else{
					this.linkList.push(this.linktext)
					this.linktext = ''
					this.isLinkSelect = false
				}
			},
			// 删除链接
			deleteLink:function(index){
				this.linkList.splice(index,1)
			},
			// 删除文件
			deleteFile:function(index){
				this.fullSize -= this.fileList[index].size
				this.fileList.splice(index,1)
			},
			// 删除图片
			deletePic:function(index){
				this.imglist.splice(index,1)
				this.fullSize -= this.imgSizeList[index]
				this.imgSizeList.splice(index,1)
			},
			// 删除原文件
			deleteFileOrigin:function(index){
				this.originFileList.splice(index,1)
			},
			// 删除原图片
			deletePicOrigin:function(index){
				this.originImageList.splice(index,1)
			},
			// 删除原链接
			deleteLinkOrigin:function(index){
				this.originLinkList.splice(index,1)
			},
			// label点击
			labelClick:function(index){
				console.log(index)
				this.$set(this.industryJudge,index,!this.industryJudge[index])
			},
			// 切换豆子价格
			peerChange:function(e){
				this.peerIndex = e.target.value
				console.log(this.peerIndex)
			},	
			// radio切换
			radioChange:function(i){
				console.log(i)
				if(i === 1){
					if(this.radio1Select === true){
						return
					}
					else{
						this.radio1Select = true
						this.radio2Select = false
					}
				}
				if(i === 2){
					if(this.radio2Select === true){
						return
					}						
					else{
						this.radio2Select = true
						this.radio1Select = false
					}
				}
			},
			// 确认发布
			confirmPublish:function(){
				if(this.title.match(/^[ ]*$/)){
					uni.showToast({
						title:'请填写标题！',
						icon:'none'
					})
					return
				}
				if(this.detailtext.match(/^[ ]*$/) && this.originImageList.length === 0&& this.originFileList.length === 0 && this.originLinkList.length === 0&& this.imglist.length === 0&& this.fileList.length === 0&& this.linkList.length === 0){
					uni.showToast({
						title:'请完善详情！',
						icon:'none'
					})
					return
				}
				let count = 0
				this.industryJudge.forEach(function (item){
					if(item === false)
					{
						count += 1
					}
				})
				if(count === 5){
					uni.showToast({
						title:'请至少选择一个行业！',
						icon:'none'
					})
					return
				}
				// 校验
				this.checkTextSecurity()
			},
			// 图片预览
			previewImg:function(i){
				let temp=[]
				for(let i = 0;i<this.originImageList.length;i++){
					temp.push(this.$store.state.baseUrl + '/file/'+ this.originImageList[i].link)
				}
				temp.push(...this.imglist)
				uni.previewImage({
					current:i,
					urls:temp
				})
			},
			// 上传图片,前端添加水印
			takePhoto:function() {
				let that = this
				let imgNum = this.imglist.length
				if(imgNum === 9){
					uni.showToast({
						title:'最多上传9张图片',
						icon:'none'
					})
					return
				}
				// 选择图片
				uni.chooseImage({
					count: 9 - imgNum,
					success(res) {
						console.log(res)
						that.checkImgSecurity(res.tempFilePaths,0)
					}
				})
			},
			watermarkPre:function(file){
				let that = this;
				// 获取水印昵称
				let nickname = '@' + this.$store.state.userInfoPlatform.user.userName
				// 循环绘制水印
				for (let i = 0; i < file.length; i++) {
					uni.showLoading({
						title: '绘制水印中'
					})
					// 最多九张图，防止因为延时出现冲突，创建9个canvas
					uni.getImageInfo({
						src: file[i],
						success: (ress) => {
							let ctx;
							if (i === 0) {
								that.w = ress.width / 2 + 'px';
								that.h = ress.height / 2 + 'px';
								// 等参数渲染完成后创建
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('first'); /** 创建画布 */
									that.addWatermark(ctx, 'first', file, ress, i,nickname)
								});
							}
							if (i === 1) {
								that.w2 = ress.width / 2 + 'px';
								that.h2 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('second'); /** 创建画布 */
									that.addWatermark(ctx, 'second', file, ress, i,nickname)
								});
							}
							if (i === 2) {
								that.w3 = ress.width / 2 + 'px';
								that.h3 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('third'); /** 创建画布 */
									that.addWatermark(ctx, 'third', file, ress, i,nickname)
								});
							
							}
							if (i === 3) {
								that.w4 = ress.width / 2 + 'px';
								that.h4 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('fourth'); /** 创建画布 */
									that.addWatermark(ctx, 'fourth', file, ress, i,nickname)
								});
							
							}
							if (i === 4) {
								that.w5 = ress.width / 2 + 'px';
								that.h5 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('fifth'); /** 创建画布 */
									that.addWatermark(ctx, 'fifth', file, ress, i,nickname)
								});
							
							}
							if (i === 5) {
								that.w6 = ress.width / 2 + 'px';
								that.h6 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('sixth'); /** 创建画布 */
									that.addWatermark(ctx, 'sixth', file, ress, i,nickname)
								});
							
							}
							if (i === 6) {
								that.w7 = ress.width / 2 + 'px';
								that.h7 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('seventh'); /** 创建画布 */
									that.addWatermark(ctx, 'seventh', file, ress, i,nickname)
								});
							
							}
							if (i === 7) {
								that.w8 = ress.width / 2 + 'px';
								that.h8 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('eighth'); /** 创建画布 */
									that.addWatermark(ctx, 'eighth', file, ress, i,nickname)
								});
							
							}
							if (i === 8) {
								that.w9 = ress.width / 2 + 'px';
								that.h9 = ress.height / 2 + 'px';
								that.$nextTick(function() {
									ctx = uni.createCanvasContext('ninth'); /** 创建画布 */
									that.addWatermark(ctx, 'ninth', file, ress, i,nickname)
								});
							}
						}
					});
				}
			},
			// 绘制水印
			addWatermark: function(ctx, canvasId, file, ress, i,nickname) {
				let that = this
				// 将原图绘制到canvas上
				ctx.drawImage(file[i], 0, 0, ress.width / 2, ress.height / 2)
				ctx.setFontSize(ress.width / 60)
				ctx.setFillStyle('#FFFFFF')
				ctx.shadowBlur = 3;
				ctx.shadowColor = "black";
				// 计算昵称长度
				var textWidth = ctx.measureText(nickname).width
				let textToWidth = ress.width / 2 - ress.width / 120 - textWidth;
				let textToHeight = ress.height / 2 - ress.width / 120;
				// 填充昵称
				ctx.fillText(nickname, textToWidth, textToHeight)
				/** 加入豆子图片水印 */
				ctx.drawImage('/static/pic/detail/white-peers4x.png', textToWidth - ress.width / 60 * 1.5, textToHeight - ress.width /
					60, ress.width / 60 * 1.36, ress.width / 60)
				// 绘制,必须放在draw回调中
				ctx.draw(false, () => {
					// 延时,不延时有bug
					setTimeout(function() {
						uni.canvasToTempFilePath({
							canvasId: canvasId,
							success: (res1) => {
								that.imglist.push(res1.tempFilePath)
								uni.getFileInfo({
									filePath:res1.tempFilePath,
									success(res2) {
										that.fullSize += res2.size
										that.imgSizeList.push(res2.size)
									}
								})
								if (i === file.length - 1) {
									uni.hideLoading()
								}
							}
						});
					}, 100);
				});
			},
			// 多张图片的上传
			uploadMultipleImage: function(i) {
				this.$refs.percentPopup.open()
				let that = this
				const imgTask = uni.uploadFile({
					url: this.$store.state.baseUrl + '/image/upFile',
					filePath: this.imglist[i],
					name: 'file',
					formData: {
						path:`interview/${this.$store.state.userOpenID}`
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode!==200){
							uni.showToast({
								icon:'none',
								title:'上传图片失败！',
							})
							that.$refs.percentPopup.close()
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code !== 200){
							uni.showToast({
								title:'上传图片失败！',
								icon:'none'
							})
							that.$refs.percentPopup.close()
							return
						}
						that.tempUploadImagePath.push(data.data)
						if (i === that.imglist.length -1) { //当图片传完时，停止调用
							console.log('执行完毕');
							that.$nextTick(function(){
								if(that.fileList.length !== 0){
									that.uploadMultipleFile(0)
								}
								if(that.fileList.length === 0){
									that.uploadInterview()
								}
							})
							
							// that.uploadOffer()
						} else { //若图片还没有传完，则继续调用函数
							that.uploadMultipleImage(i+1); //递归，回调自己
						}
					},
					fail: (err) => {
						console.log(err)
						that.$refs.percentPopup.close()
						uni.showToast({
							icon:'none',
							title:'上传图片失败！'
						})
						return
					}
				});
				let tempSize = this.uploadSize
				imgTask.onProgressUpdate((res)=>{
					that.uploadSize = tempSize+res.totalBytesSent
				})
			},
			// 多个文件的上传
			uploadMultipleFile: function(i) {
				this.$refs.percentPopup.open()
				let that = this
				const fileTask = uni.uploadFile({
					url: this.$store.state.baseUrl + '/image/upFile',
					filePath: this.fileList[i].path,
					name: 'file',
					formData: {
						path:`interview/${this.$store.state.userOpenID}`
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode!==200){
							uni.showToast({
								icon:'none',
								title:'上传文件失败！',
							})
							that.$refs.percentPopup.close()
							return
						}
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code !== 200){
							uni.showToast({
								title:'上传图片失败！',
								icon:'none'
							})
							that.$refs.percentPopup.close()
							return
						}

						that.tempFilePathList.push(data.data)
						//当文件传完时，停止调用
						if (i === that.fileList.length -1) { 
							console.log('执行完毕');
							that.$nextTick(function(){
								that.uploadInterview()
							})
							// that.uploadOffer()
						} else { 
							that.uploadMultipleFile(i+1); //递归，回调自己
						}
					},
					fail: (err) => {
						console.log(err)
						that.$refs.percentPopup.close()
						uni.showToast({
							icon:'none',
							title:'上传图片失败！'
						})
						return
					}
				});
				let tempSize = this.uploadSize
				fileTask.onProgressUpdate((res)=>{
					that.uploadSize = tempSize + res.totalBytesSent
				})
			},
			// 上传面经
			uploadInterview:function(){
				let that = this
				let price = 0
				// 获取价格
				if(this.radio2Select === true){
					price = this.peerRange[this.peerIndex]
				}
				let pageId = this.pageDetail.interviewexperience.interviewexperienceId
				// 获取行业标签
				let IndustryLabel = ''
				for(let i = 0;i<this.industryJudge.length;i++){
					if(this.industryJudge[i] === true){
						if(i === 0){
							IndustryLabel += '互联网,'
						}
						if(i === 1){
							IndustryLabel += '金融,'
						}
						if(i === 2){
							IndustryLabel += '咨询,'
						}
						if(i === 3){
							IndustryLabel += '快消,'
						}
						if(i === 4){
							IndustryLabel += '其他,'
						}
					}
				}
				// 切除行业最后一个逗号
				IndustryLabel = IndustryLabel.slice(0,-1)
				// 详情列表
				let detailList = []
				// 将原连接压入详情列表
				if(this.originLinkList.length !== 0){
					detailList.push(...this.originLinkList)
				}
				// 将新连接压入详情
				if(this.linkList.length !== 0){
					for(let i =0;i<this.linkList.length;i++){
						detailList.push({
							id:pageId,
							title:'',
							link:this.linkList[i],
							type:0,
						})
					}
				}
				// 原文件
				if(this.originFileList.length !== 0){
					detailList.push(...this.originFileList)
				}
				// 将文件压入详情列表
				if(this.tempFilePathList.length !== 0){
					for(let i =0;i<this.tempFilePathList.length;i++){
						detailList.push({
							id:pageId,
							title:this.fileList[i].name,
							link:this.tempFilePathList[i],
							type:1,
						})
					}
				}
				// 将原图压入detail
				if(this.originImageList.length !== 0){
					detailList.push(...this.originImageList)
				}
				// 将图片压入详情列表
				if(this.tempUploadImagePath.length !== 0){
					for(let i =0;i<this.tempUploadImagePath.length;i++){
						detailList.push({
							id:pageId,
							title:'',
							link:this.tempUploadImagePath[i],
							type:2,
						})
					}
				}
				// 判断封面情况，原数组不为空且开关为开，封面为原数组第一张
				let coverPath = ''
				if(this.originImageList.length !== 0 && this.isFirstPicAsCover === true){
					coverPath = this.originImageList[0].link
				}
				if(this.originImageList.length === 0 && this.tempUploadImagePath.length !== 0 && this.isFirstPicAsCover === true){
					coverPath = this.tempUploadImagePath[0]
				}
				//detailList = this.$qs.stringify(detailList)
				// 上传的data
				let interviewDetail = {
					interviewexperienceId:pageId,
					title:this.title,
					cover:coverPath,
					label:IndustryLabel,
					price:price,
					summary:this.info,
					text:this.detailtext
				}
				let data = {
					interviewexperience:interviewDetail,
					list:detailList
				}
				this.percent = 99
				//data = this.$qs.stringify(data)
				// json格式 ,不做 stringify转义
				this.$axios.request({
					url: `/interview/updateInterviewExperience`,
					method: 'post',
					header:{
						'Content-Type':'application/json'
					},
					data
				}).then(function({data}) {
					console.log(data)
					console.log('上传成功')
					uni.reLaunch({
						url:`../publishSuccess/publishSuccess?type=edit`
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取面经信息
			getInterview:function(id){
				let that = this
				this.$axios.request({
					url: `/interview/GetInterviewExperience`,
					method: 'get',
					params:{
						id:id,
						isLock:0
					}
				}).then(function({data}) {
					console.log(data)
					// 将原始面经存储
					that.pageDetail = data.data
					that.syncDetail(data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 同步面经信息
			syncDetail:function(data){
				// 判断详情数组，填写link，file，img
				for(let i =0;i<data.details.length;i++){
					if(data.details[i].type === 0){
						this.originLinkList.push(data.details[i])
					}
					if(data.details[i].type === 1){
						this.originFileList.push(data.details[i])
					}
					if(data.details[i].type === 2){
						this.originImageList.push(data.details[i])
					}
				}
				// 填写标题
				this.title = data.interviewexperience.title
				// 填写简介
				this.info = data.interviewexperience.summary
				this.infoTextareaNum = data.interviewexperience.summary.length
				// 详情
				this.detailtext = data.interviewexperience.text
				this.detailTextareaNum = data.interviewexperience.text.length
				// 切割标签
				let temp = data.interviewexperience.label.split(',')
				console.log(temp)
				for(let i = 0;i<temp.length;i++){
					if(temp[i] === '互联网'){
						this.industryJudge[0] = true
					}
					if(temp[i] === '金融'){
						this.industryJudge[1] = true
					}
					if(temp[i] === '咨询'){
						this.industryJudge[2] = true
					}
					if(temp[i] === '快消'){
						this.industryJudge[3] = true
					}
					if(temp[i] === '其他'){
						this.industryJudge[4] = true
					}
				}
				// 判断价格
				if(data.interviewexperience.price > 0){
					this.radio1Select = false
					this.radio2Select = true
					this.peerIndex = data.interviewexperience.price - 1
				}
			},
			// 上传文本的安全校验
			checkTextSecurity:function(){
				this.$refs.percentPopup.open()
				let that = this
				let data = {
					text:this.title + this.info + this.detailtext
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/wx/checkText`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// 没有封面有图片的情况
					if(that.imglist.length !== 0){
						that.uploadMultipleImage(0)
					}
					// 没有封面，没有图片，有文件的情况
					if(that.imglist.length === 0 && that.fileList.length !== 0){
						that.uploadMultipleFile(0)
					}
					// 没有封面没有图片没有文件
					if(that.imglist.length === 0 && that.fileList.length === 0){
						that.percent = 50
						that.uploadInterview()
					}
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
							that.watermarkPre(file)
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
			},
			// 第一张图作为封面开关
			closeFisrtPicAsCover:function(){
				this.isFirstPicAsCover = !this.isFirstPicAsCover
			}
		},
		onLoad:function(options){
			console.log(options)
			let that = this
			// 获得类型
			this.type = options.type
			this.getInterview(options.id)
			this.baseUrl = this.$store.state.baseUrl
		},
		watch:{
			uploadSize(val){
				if(parseInt(val/this.fullSize * 100)<100){
					this.percent = parseInt(val/this.fullSize * 100)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	// 标题编辑
	.editTitle {
		margin: 36upx;

		text {
			&:nth-child(1) {
				color: #00A29A;
				margin-right: 4upx;
			}

			&:nth-child(2) {
				font-size: 28upx;
			}

			&:nth-child(3) {
				font-size: 20upx;
			}
		}

		input {
			margin-top: 10upx;
			height: 70upx;
			font-size: 24upx;
			color: #4F4F4F;
			padding: 0 24upx;
			background: #F2F2F2;
			border-radius: 20upx;
		}
	}

	// 封面
	.cover {
		margin: 36upx;

		text {
			font-size: 28upx;
		}

		view {
			height: 220upx;
			border: 6upx dashed #E0E0E0;
			border-radius: 20upx;
			margin-top: 10upx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 60upx;
				height: 60upx;
			}
		}
		.cropImage{
			display: block;
			margin-top: 10upx;
			width: 656upx;
			height: 328upx;
		}
	}
	// 简介
	.info{
		margin: 36upx;
		position: relative;
		text {
			&:nth-child(1) {
				color: #00A29A;
				margin-right: 4upx;
			}
		
			&:nth-child(2) {
				font-size: 28upx;
			}
		
		}
		textarea{
			margin-top: 10upx;
			background-color: #F2F2F2;
			height: 144upx;
			color: #828282;
			font-size: 24upx;
			border-radius: 20upx;
			padding: 16upx 24upx 48upx 24upx;
			text-align: justify;
			line-height: 34upx;
			width: 678upx;
			box-sizing: border-box;
		}
		.num{
			font-size: 24upx;
			color: #BDBDBD;
			position: absolute;
			right: 24upx;
			bottom: 20upx;
			text{
				color: #00A29A;
			}
		}
	}
	// 详情
		
	.detail{
		margin: 36upx;
		position: relative;
		// 内容详情标题
		.detail-title{
			text {
				&:nth-child(1) {
					color: #00A29A;
					margin-right: 4upx;
				}
				&:nth-child(2) {
					font-size: 28upx;
				}
			}
		}
		// 附件标题
		.append-title{
			margin-top: 36upx;
			font-size: 28upx;
			display: flex;
			align-items: center;
			view{
				margin-left: auto;
				display: flex;
				align-items: center;
				image{
					margin-left: 10upx;
					width: 48upx;
					height: 27.4upx;
				}
			}
		}
		.addDetail {
			height: 220upx;
			border: 6upx dashed #E0E0E0;
			border-radius: 20upx;
			margin-top: 10upx;
			display: flex;
			align-items: center;
			justify-content: center;
		
			image {
				width: 60upx;
				height: 60upx;
			}
			text{
				display: block;
				font-size: 24upx;
				color: #BDBDBD;
			}
		}
		.addText{
			position: relative;
			textarea{
				margin-top: 10upx;
				background-color: #F2F2F2;
				height: 340upx;
				color: #828282;
				font-size: 24upx;
				border-radius: 20upx;
				padding: 16upx 24upx 48upx 24upx;
				text-align: justify;
				line-height: 34upx;
				width: 678upx;
				box-sizing: border-box;
			}
			.num{
				font-size: 24upx;
				color: #BDBDBD;
				position: absolute;
				right: 24upx;
				bottom: 20upx;
				text{
					color: #00A29A;
				}
			}
		}
		// 添加链接
		.addLink{
			margin-top: 10upx;
			input {
				height: 70upx;
				font-size: 24upx;
				color: #4F4F4F;
				padding: 0 24upx;
				background: #F2F2F2;
				border-radius: 20upx;
			}
		}
		// 链接
		.link{
			margin-top: 20upx;
			display: flex;
			align-items: center;
			image{
				width: 40upx;
				height: 50upx;
				margin-right: 10upx;
				flex-shrink:0
			}
			text{
				font-size: 24upx;
				color: #4D4D4D;
				word-break:break-all;
			}
			.closeImg{
				width: 40upx;
				height: 40upx;
				flex-shrink:0;
				transform: translateY(3upx);
			}	
		}
		
		// 修改图片
		.editPic{	
			margin-top: 20upx;
			.preImage{
				margin-right: 39upx;
				margin-bottom: 39upx;
				float: left;
				width: 200upx;
				height: 200upx;
				position: relative;
				.smallpic{
					border-radius: 20upx;
					width: 200upx;
					height: 200upx;
				}
			
				&:nth-child(3n+0){
					margin-right: 0;
				}
				.closePicImg{
					width: 40upx;
					height: 40upx;
					position: absolute;
					top: -15upx;
					right: -15upx;
				}
			}
		}
	}
	// 行业标签
	.industry{
		margin: 36upx;
		
		text {
			&:nth-child(1) {
				color: #00A29A;
				margin-right: 4upx;
			}
		
			&:nth-child(2) {
				font-size: 28upx;
			}
		
			&:nth-child(3) {
				font-size: 20upx;
			}
		}
		.industry-label{
			margin-top: 20upx;
			text{
				padding: 16upx;
				border-radius: 20upx;
				border:1px solid #BDBDBD;
				margin-right: 20upx;
				font-size: 24upx;
				color: #BDBDBD;
				&:nth-child(n+2){
					padding: 16upx 30upx;
				}
			}
			.labelSelect{
				border: 1px solid #00A29A;
				background-color: #00A29A;
				color: #FFFFFF;
			}
		}
	}
	// 解锁条件
	.condition{
		margin: 36upx;
		
		text {
			&:nth-child(1) {
				color: #00A29A;
				margin-right: 4upx;
			}
		
			&:nth-child(2) {
				font-size: 28upx;
			}
		}
		// 选项一
		.radio1{
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: #4F4F4F;
			margin-top: 20upx;
			
		}
		// 选项二
		.radio2{
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: #4F4F4F;
			margin-top: 20upx;
			margin-left: 64upx;
			.peers{
				width: 50upx;
				height: 40upx;
			}
			.num{
				padding: 6upx 30upx 6upx 12upx;
				background-color: #F2F2F2;
				font-size: 20upx;
				border-radius: 10upx;
				margin-left: 8upx;
			}
		}
		// 白色
		.okWhite{
			width: 30upx;
			height: 30upx;
			border: 1.5px solid #BDBDBD;
			border-radius: 4upx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10upx;
			image{
				width: 20upx;
				height: 20upx;
			}
		}
		// 选中绿色
		.okGreen{
			width: 30upx;
			height: 30upx;
			border: 1.5px solid #00A29A;
			background-color: #00A29A;
			border-radius: 4upx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10upx;
			image{
				width: 20upx;
				height: 20upx;
			}
		}
		// 豆子选择器
		.picker-style{
			background-color: #F2F2F2;
			border-radius: 10upx;
			height: 40upx;
			width: 80upx;
			view{
				display: flex;
				align-items: center;
				font-size: 20upx;
				color: #4F4F4F;
				margin-left: 14upx;
				height: 40upx;
				width: 80upx;
			}
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
</style>
