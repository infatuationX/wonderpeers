<template>
	<view>
		<!-- 个人页面头部 -->
		<!-- 授权button -->
		<button open-type="getUserInfo" class="getInfo-btn" @getuserinfo="getUserInfo" v-if="!isAuthorize"></button>
		<view class="profile-head">
			<!-- 头像昵称 -->
			<view style="height: 128upx;background-color: #00A29A;">
			</view>
			<view class="userhead">
				<!-- 头像默认 -->
				<image :src="isAuthorize ? `${baseUrl}/file/${userInfo.user.userPot}`:'../../static/pic/me/unsign.png'" mode="aspectFill" class="avatar" v-if="!isAvatarUploadSuccess" @click="uploadAvatar"></image>
				<!-- 头像替换 -->
				<image :src="`${baseUrl}/file/${avatarPath}`"  @click="uploadAvatar" class="avatar" v-if="isAvatarUploadSuccess" mode="aspectFill"></image>
				<view style="display: flex;align-items: center;" v-if="!isNicknameEdit">
					<!-- 昵称 -->
					<text class="nickname" >{{isAuthorize?userInfo.user.userName:'未登录'}}</text>
					<!-- 编辑 -->
					<image src="../../static/pic/detail/edit.svg" mode="" class="edit" v-if="isAuthorize" @click="editNickname" ></image>
				</view>
				
				<!-- 更多选项 -->
				<view class="more-option" @click="openBottomDialog" v-if="!isNicknameEdit">
					<!-- 个人选项的三个点 -->
					<view class="dot">		
					</view>
					<view class="dot">
					</view>
					<view class="dot">
					</view>
				</view>
				<!-- 昵称修改框 -->
				<view class="nickname-edit" v-if="isNicknameEdit">
					<input type="text" maxlength="16" v-model="tempNickname" :auto-focus="true" @blur="quitNicknameEdit" style="width: 400upx;"/>
					<image src="../../static/pic/detail/right.png" mode="" @click="conformNicknameEdit"></image>
				</view>
			</view>
			<!-- 我的收藏等信息 -->
			<view class="mine">
				<view @click="switchToPagePeers">
					<text>{{userInfo.user.bean}}</text>
					<text>我的豆子</text>
				</view>
				<view @click="switchToPage(1)">
					<text>{{userInfo.user.issueNum}}</text>
					<text >我的发布</text>
				</view>
				<view @click="switchToMyFollow">
					<text>{{userInfo.user.followNum}}</text>
					<text>我的关注</text>
				</view>
				<view @click="switchToPage(3)">
					<text>{{userInfo.user.unlockNum}}</text>
					<text>我的解锁</text>
				</view>
				<view @click="switchToPage(4)">
					<text>{{userInfo.user.collectionNum}}</text>
					<text>我的收藏</text>
				</view>
			
			</view>
		</view>
		<view style="height: 428upx;">
			
		</view>
		<!-- 头部下广告 -->
		<view class="advertisement">
			<image src="../../static/pic/detail/offerBgDouble.jpg" mode="widthFix" class="adbg"></image>
			
			<!-- 文字广告 -->
			<view class="adtext">
				邀请一个新好友 获得豆子x5！
				<button open-type="share">去邀请</button>
			</view>
			<button open-type="share" class="share-big-btn"></button>
		</view>
		<!-- 个人页四个选项 -->

		<!-- offer认证 -->
		<view>
			<view class="identify">
				<image src="../../static/pic/me/me-logo1.svg" mode=""></image>
				<text>offer认证</text>
				<image src="../../static/pic/me/add.svg" mode="" @click="addOffer"></image>
			</view>
			<!-- offer认证具体 -->
			<view class="offer" v-for="(item,i) in userInfo.workexperiences" :key = "i" @click="switchToOfferEdit(item.id)"> 
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
					<text class="internship" v-if="item.workType === '实习'">实习</text>
					<text class="fulltime" v-if="item.workType === '全职'">全职</text>
					<image src="../../static/pic/me/tri-gary.svg" mode=""></image>
				</view>
			</view>
		</view>

		<!-- 教育经历 -->
		<view> 
			<view class="identify"> 
				<image src="../../static/pic/me/me-logo2.svg" mode=""></image>
				<text>教育经历</text>
				<image src="../../static/pic/me/add.svg" mode="" @click="addEdu"></image>
			</view>
			<!-- 教育经历详情 -->
			<view class="edu" v-for="(item,i) in userInfo.educationexperiences" :key = "i" @click="switchToEduEdit(item.id)">
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
					<image src="../../static/pic/me/tri-gary.svg" mode=""></image>
				</view>
			</view>
		</view>
		
		<!-- 活动经历 -->
		<view >
			
		<view class="identify">
			<image src="../../static/pic/me/me-logo3.svg" mode=""></image>
			<text>活动经历</text>
			<image src="../../static/pic/me/add.svg" mode="" @click="addActivity"></image>
		</view>
		<!-- 活动经历详情 -->
		<view class="edu" v-for="(item,i) in userInfo.activityexperiences" :key = "i" @click="switchToActivityEdit(item.id)">
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
				<image src="../../static/pic/me/tri-gary.svg" mode=""></image>
			</view>
		</view>
		</view>
		<view>
			<!-- 个人技能 -->
			<view class="identify">
				<image src="../../static/pic/me/me-logo4.svg" mode=""></image>
				<text>个人技能</text>
				<image :src="skillImg" mode="" @click="editSkill"></image>
			</view>
			<!-- 个人技能标签 -->
			<view class="skill">
				<view class="skillItem" v-for="(item,i) in userInfo.Skill" :key="i" :class="isSkillEdit?'bigger':''" v-if="item !== ''">
					<text>{{item}}</text>
					<image src="../../static/pic/me/x.svg" mode="" @click="deleteSkill(i)" v-if="isSkillEdit"></image>
				</view>
				<input type="text" placeholder="请输入,回车完成" confirm-type="done" @confirm="addSkill" v-model="skillInput" v-if="isSkillEdit"/>
			</view>
		</view>
		<!-- 底部的占位 -->
		<view style="height: 136upx; clear: both;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);" >
		</view>
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="bottom" style="background-color: #FFFFFF;"><view class="pop">
			<view class="popItem" @click="switchToWonderpeers">
				关于豌豆派
			</view>
			<view class="popItem popNoborder">
				<button open-type="contact">联系豆豆</button>
			</view>
			<view class="cancel" @click="closePopup">
				取消
			</view>
		<!-- 	<view class="block" >
				
			</view> -->
			
		</view></uni-popup>
		
		<!-- 选择身份弹出层 -->
		<uni-popup-sp type="center" ref="idpopup" :maskClick="false">
			<view class="identity">
				<view class="title">选择身份，认识更多朋友</view>
				<!-- 选项 -->
				<view class="item" v-for="(item,i) in indentSelect" :key = "i" :class="{'item-select':i===idSelectMark}" @click="idSelect(i)">
					{{item}}
				</view>
				<view class="skip" @click="idSkip">
					跳过
				</view>
			</view>	
		</uni-popup-sp>
		
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
	// 引入弹窗组件
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	export default {
		components: {
			uniPopup,uniPopupSp
		},
		data() {
			return { 
				offer:[],
				isSkillEdit:false,
				skillImg:'../../static/pic/me/add.svg',
				skillList:[],
				skillInput:'',
				actionSheetHidden:true,
				// 个人信息
				userInfo:{},
				// 身份选项
				indentSelect:['我拥有全职Offer，已经上岸啦！希望结识和帮助更多的小伙伴！','我拥有实习Offer，还在求职中，希望向前辈们继续学习看齐！','我还是小白，需要更加努力呢!'],
				idSelectMark:-1,
				// 登录状态
				isLogin:false,
				// 头像上传成功监听
				isAvatarUploadSuccess:false,
				// 头像的临时路径
				avatarPath: '',
				// 昵称编辑状态
				isNicknameEdit:false,
				// 临时昵称
				tempNickname:'',
				tempPeerpath:'',
				// 临时技能列表
				tempSkillList:[],
				baseUrl:'',
				isAuthorize:false
			}
		},
		onShow() {
			this.setTabBarIndex(2) //index为当前tab的索引
			// 同步一次个人信息
			this.getSelfInfo()
		},
		methods:{
			// 打开底部身份认证等选项
			openBottomDialog:function(){
				this.$refs.popup.open()
				this.$mp.page.getTabBar().setData({
					show:false
				})
			},
			// 页面切换
			switchToPage:function(type){
				uni.navigateTo({
					url:`../myDetails/myDetails?type=${type}`,
				})
			},
			// 切换到我的关注
			switchToMyFollow:function(){
				uni.navigateTo({
					url:'../myFollow/myFollow'
				})
			},
			// 切换到教育编辑
			switchToEduEdit:function(id){
				uni.navigateTo({
					url:`../EduAuthentication/EduAuthentication?id=${id}`
				})
			},
			switchToActivityEdit:function(id){
				uni.navigateTo({
					url:`../activityAuthentication/activityAuthentication?id=${id}`
				})
			},
			// 编辑状态切换
			editSkill:function(){
				if(this.isSkillEdit === false){
					let tmp = ''
					if(this.userInfo.Skill === null){
						tmp = ''
					}
					else{
						for(let i = 0;i<this.userInfo.Skill.length;i++){
							tmp += this.userInfo.Skill[i] + '/'
						}
					}
					console.log(tmp)
					this.tempSkillList = tmp
					this.$nextTick(function(){
						this.isSkillEdit = true
						this.skillImg = '../../static/pic/me/ok.svg' 
					})
				}	
				else{
					let tmp = ''
					if(this.userInfo.Skill === null){
						tmp = ''
					}
					else{
						for(let i = 0;i<this.userInfo.Skill.length;i++){
							tmp += this.userInfo.Skill[i] + '/'
						}
					}
					// 判断如果skill没有改变则不作处理
					if(tmp === this.tempSkillList){
						this.isSkillEdit = false
						this.skillImg = '../../static/pic/me/add.svg'
						return
					}
					else{
						console.log(tmp)
						this.checkTextSecurity(tmp,'skill')
					}
					// this.isSkillEdit = false
					// this.skillImg = '../../static/pic/me/add.svg'
				}
			},
			// 删除对应技能
			deleteSkill:function(index){
				this.userInfo.Skill.splice(index,1)
			},
			// 添加技能
			addSkill:function(){
				if(this.skillInput.match(/^[ ]*$/)){
					return
				}
				else{
					if(this.userInfo.Skill === null){
						this.userInfo.Skill = []
					}
					this.userInfo.Skill.push(this.skillInput)
					this.skillInput = ''
				}
			},
			// 技能同步至服务器
			addSkillToServer:function(skill){
				let that = this
				this.$axios.request({
					url:`/user/upDataUserSkill`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID,
						skill:skill
					}
				}).then(function({data}){
					console.log(data)
					if(data.code === 200){
						that.isSkillEdit = false
						that.skillImg = '../../static/pic/me/add.svg'
						uni.showToast({
							title:'修改成功！'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 关闭弹出层
			closePopup:function(){
				this.$refs.popup.close()
				//console.log(this)
				// this.$mp.page.getTabBar().setData({
				// 	show:true
				// })
			},
			// 添加教育经历
			addEdu:function(){
				uni.navigateTo({
					url:'../EduAuthentication/EduAuthentication'
				})
			},
			// 跳转至添加offer
			addOffer:function(){
				if(this.userInfo.user.authentication === -1 || this.userInfo.user.authentication === -2){
					uni.navigateTo({
						url:'../personalAuthentication/personalAuthentication?offer=true'
					})
					return
				}
				uni.navigateTo({
					url:'../offerAuthenticationv2/offerAuthenticationv2'
				})
			},
			// 添加活动经历
			addActivity:function(){
				uni.navigateTo({
					url:'../activityAuthentication/activityAuthentication'
				})
			},
			// 跳转至收益
			switchToPagePeers:function(){
				uni.navigateTo({
					url:'../myPeers/myPeers'
				})
			},
	
			// 身份选择
			idSelect:function(i){
				let that = this
				this.idSelectMark = i
				console.log(i)
				this.uploadUserIndentSelect(i)
			},
			// 跳过
			idSkip:function(){
				this.$refs.idpopup.close()
				this.uploadUserIndentSelect(3)
			},
			// 上传用户对身份的选择
			uploadUserIndentSelect:function(id){
				let that = this
				this.$axios.request({
					url:`/user/upUserSummary`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID,
						Summary:id
					}
				}).then(function({data}){
					console.log(data)
					setTimeout(function() {
						that.$refs.idpopup.close()
					}, 500);
				}).catch(err => {
					console.log(err)
				})
			},
			// 上传头像
			uploadAvatar:function() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						that.uploadFileToServer(res.tempFilePaths[0]) 
						// this.avatarPath = res.tempFilePaths.shift()
						// this.isAvatarUploadSuccess = true
					}
				});
			},
			// 上传头像文件,换取服务器文件地址
			uploadFileToServer:function(url){
				let that = this
				uni.uploadFile({
					url:`${this.baseUrl}/image/upFile`,
					filePath:url,
					name:'file',
					formData:{
						path:`user/${this.userInfo.user.openId}`
					},
					success(res){
						console.log(res)
						if(res.statusCode !== 200){
							uni.showToast({
								title:'上传文件失败！',
								icon:'none'
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
						that.uploadAvatarToServer(data.data)
					},
					fail(err){
						console.log(err)
						uni.showToast({
							title:'上传文件失败！',
							icon:'none'
						})
						return
					}
				})
			},
			// 上传新头像地址到服务器
			uploadAvatarToServer:function(url){
				let that = this
				let data = {
					openid:this.userInfo.user.openId,
					userName:this.userInfo.user.userName,
					filePot:url,
					oldPot:this.userInfo.user.userPot
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/upDataUserName`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					uni.showToast({
						title:'修改成功！'
					})
					that.avatarPath = url
					that.isAvatarUploadSuccess = true
					that.userInfo.user.userPot = url
					that.$store.commit('updateAvatar',url)
				}).catch(err => {
					console.log(err)
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
			// 编辑昵称
			editNickname:function(){
				this.isNicknameEdit = true
			},
			// 确定修改昵称
			conformNicknameEdit:function(){
				if(this.tempNickname.match(/^[ ]*$/)){
					return
				}
				else{
					this.checkTextSecurity(this.tempNickname)
				}
			},
			// 上传头像与昵称至服务器
			uploadNickname:function(){
				let that = this
				let data = {
					openid:this.userInfo.user.openId,
					userName:this.tempNickname,
					filePot:this.userInfo.user.userPot,
					oldPot:this.userInfo.user.userPot
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/upDataUserName`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					uni.showToast({
						title:'修改成功！'
					})
					that.userInfo.user.userName = that.tempNickname
					that.$store.commit('updateUsername',that.tempNickname)
					that.isNicknameEdit = false
				}).catch(err => {
					console.log(err)
				})
			},
			// 分享函数
			onShareAppMessage(options) {
				var that = this;
				// 设置菜单中的转发按钮触发转发事件时的转发内容
				var shareObj = {
					title:'顶尖高校职场同龄人聚集地',
					path: `/pages/fontpage/fontpage?shareOpenId=${this.$store.state.userOpenID}`,
					imageUrl:'../../static/pic/bg/share-pic.jpg'
				}
				// 来自页面内的按钮的转发
				return shareObj;
			},
			// 启动时同步个人信息到缓存
			getSelfInfo:function(){
				if(uni.getStorageSync('userInfoPlatform')){
					this.userInfo = this.$store.state.userInfoPlatform,
					this.isLogin = this.$store.state.isLogin
				}
				else{
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
						that.userInfo = that.$store.state.userInfoPlatform,
						that.isLogin = that.$store.state.isLogin
					}).catch(err => {
						console.log(err)
					})
				}
				
			},
			// 昵称输入框失去焦点事件
			quitNicknameEdit:function(){
				if(this.tempNickname.match(/^[ ]*$/)){
					this.isNicknameEdit = false
				}
			},
			
			// 以下函数仅在登录时使用
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
								// 切割上传文件后结果，将上传的路径切出
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
			// 打开身份选择弹窗
			openIdPopup:function(){
				this.$refs.idpopup.open()
				this.$mp.page.getTabBar().setData({
					show: false,
				})
			},
			// 打开关于豌豆派
			switchToWonderpeers:function(){
				let that = this
				uni.navigateTo({
					url:'../wonderpeers/wonderpeers'
				})
				setTimeout(function() {
					that.$refs.popup.close()
				}, 1000);
			},
			// offer认证
			switchToOfferEdit:function(id){
				uni.navigateTo({
					url:`../offerEdit/offerEdit?id=${id}`
				})
			},
			
			// 上传文本的安全校验
			checkTextSecurity:function(text,type){
				let that = this
				let data = {
					text:text
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/wx/checkText`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// type为skill是个人技能的安全校验
					if(type === 'skill'){
						that.addSkillToServer(text)
						return
					}
					else{
						// 昵称的校验
						that.uploadNickname()
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
		onLoad:function() {
			this.isLogin = this.$store.state.isLogin
			this.baseUrl = this.$store.state.baseUrl
			this.userInfo = this.$store.state.userInfoPlatform
			// 同步认证
			this.isAuthorize = this.$store.state.isAuthorize
			// 打开选择身份弹窗
			if(this.$store.state.userInfoPlatform.user.sumarry === null){
				this.openIdPopup()
			}
		},
		watch:{
			// 监听是否授权的全局变化
			 "$store.state.isAuthorize": function() {
			    this.isAuthorize = this.$store.state.isAuthorize
			 }
		}
	}
</script>

<style lang="less" scoped>
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
	// 个人页面头部
	.profile-head {
		width: 100%;
		background-color: #00A29A;
		border-radius: 0 0 20upx 20upx;
		overflow: hidden;
		position: fixed;
		z-index: 5;
		// 头像昵称
		.userhead {
			margin: 0 36upx 30upx 36upx;
			display: flex;
			align-items: center;

			// 头像
			.avatar {
				border: 6upx solid #FFFFFF;
				width: 110upx;
				height: 110upx;
				border-radius: 50%;
			}

			// 昵称
			.nickname {
				color: #FFFFFF;
				font-size: 36upx;
				font-weight: bold;
				margin-left: 32upx;
			}

			// 编辑
			.edit {
				width: 22.36upx;
				height: 26.36upx;
				margin-left: 10upx;
			}

			// 更多
			.more-option {
				margin-left: auto;
				display: flex;
				align-items: center;
				height: 20upx;
				.dot{
					width: 10upx;
					height: 10upx;
					border-radius: 50%;
					background-color: #FFFFFF;
					margin-left: 9upx;
				}
			}
			
			// 昵称修改
			.nickname-edit{
				margin-left: 32upx;
				color: #FFFFFF;
				font-size: 36upx;
				font-weight: bold;
				display: flex;
				align-items: center;
				image{
					margin-left: auto;
					width: 30upx;
					height: 24upx;
				}
			}
			
		}

		// 我的收藏等信息
		.mine {
			display: flex;
			margin: 36upx 36upx 48upx 36upx;
			justify-content: space-between;

			view {
				height: 96upx;
				width: 96upx;
				
				text {
					display: block;
					color: #FFFFFF;
					text-align: center;

					&:nth-child(1) {
						font-size: 44upx;
					}

					&:nth-child(2) {
						font-size: 24upx;
					}
				}
			}
		}
	}

	// 广告
	.advertisement {
		margin: 36upx;
		height: 216upx;
		border-radius: 20upx;
		overflow: hidden;
		position: relative;
		display: flex;
		align-items: center;
		// 广告背景
		.adbg{
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 20upx;
		}
		// 文字部分
		.adtext{
			font-size: 24upx;
			font-weight: 500;
			z-index: 3;
			margin-left: auto;
			margin-right: 50upx;
			width: 168upx;
			flex-direction: 0;
			button{
				background-color: #00A29A;
				border-radius: 10upx;
				color: #FFFFFF;
				font-size: 24upx;
				padding: 0;
				margin: 0;
				width: 104upx;
				height: 50upx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 14upx;
			}
		}
		.share-big-btn{
			top: 0;
			left: 0;
			width: 100%;
			height: 216upx;
			position: absolute;
			background-color: rgba(0,0,0,0);
			&::after{
				border: none;
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
				width: 30upx;
				height: 30upx;
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
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
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
			flex-shrink: 0;
			margin-left: auto;
			display: flex;
			align-items: center;
			.internship {
				font-size: 20upx;
				color: #FFFFFF;
				background-color: #f2c94c;
				border-radius: 10upx;
				padding: 2upx 16upx;
			}
			.fulltime{
				font-size: 20upx;
				color: #FFFFFF;
				background-color: #00A29A;
				border-radius: 10upx;
				padding: 2upx 16upx;
			}
			image{
				width: 12upx;
				height: 18.6upx;
				margin-left: 18upx;
			}
		}
	}
	
	// 教育经历详情
	.edu{
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
			text{
				font-size: 20upx;
				color: #BDBDBD;
			}
			image{
				width: 12upx;
				height: 18.6upx;
				margin-left: 18upx;
			}
		}
	}
	
	// 个人技能标签
	.skill{
		margin: 40upx 36upx 0 80upx;
	
		.skillItem{
			position: relative;
			margin-right: 14upx;
			float: left;
			margin-top: 10upx;
			text{
				display: block;
				color: #FFFFFF;
				background-color: #00A29A;
				height: 44.78upx;
				line-height: 44.78upx;
				padding: 0upx 16upx;
				font-size: 20upx;
				border-radius: 14upx;
			}
			image{
				position: absolute;
				width: 42upx;
				height: 42upx;
				top:-10upx;
				right: -20upx;
			}
		}
			
		.bigger{
			margin-right: 20upx;
		}
		input{
			margin-top: 10upx;
			float: left;
			width: 188upx;
			background: #F2F2F2;
			border-radius: 14upx;
			height: 44.78upx;
			font-size: 20upx;
			padding: 0 16upx;
		}
	}
	// 弹出层pop
	.pop{
		background-color: #FFFFFF;
		border-radius: 24upx 24upx 0 0;
		.popItem{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34upx;
			width: 100%;
			height: 112upx;
			border-bottom: 1px solid #e6e6e6;
			image{
				width: 56upx;
				height: 38upx;
			}
			button{
				width: 100%;
				font-size: 34upx;
				background-color: #FFFFFF;
				&::after{
					border: none;
				}
			}
		}
		.popNoborder{
			border: none;
		}	
		.cancel{
			border-top: 8px solid #F2F2F2;
			width: 100%;
			height: 112upx;
			font-size: 34upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
		}
	}
	// 选择身份弹出层
	.identity{
		width: 600upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		overflow: hidden;
		// 标题
		.title{
			text-align: center;
			color: #00A29A;
			font-size: 32upx;
			margin-top: 72upx;
			margin-bottom: 56upx;
		}
		// 选项样式
		.item{
			margin: 12upx 60upx;
			height: 124upx;
			font-size: 24upx;
			padding: 0 36upx;
			background: #FFFFFF;
			border: 1px solid #F2FAFA;
			box-sizing: border-box;
			box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20upx;
		}
		.skip{
			color: #BDBDBD;
			font-size: 28upx;
			text-align: center;
			margin-top: 72upx;
			margin-bottom: 40upx;
		}
		.item-select{
			background: #F2FAFA;
			color: #00A29A;
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
</style>
