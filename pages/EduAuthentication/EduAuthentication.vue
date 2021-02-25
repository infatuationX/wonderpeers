<template>
	<view class="identityEdu" @click="closeSearchArea">
		<!-- 学校 -->
		<view class="school">
			<view class="title">
				<text>*\t</text>
				学校
			</view>
			<view class="input-area">
				<view class="input-line">
					<input type="text" placeholder="请填写学校名称" v-model="school" @input="onSchoolInput"/>
				</view>
				
				<view class="search-area" @click.stop="searchClick" v-if="isSchoolInput">
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
			<!-- 搜索结果匹配框 -->
			
		</view>
		<!-- 专业 -->
		<view class="major">
			<view class="title">
				<text>*\t</text>
				专业
			</view>
			<view>
				<input type="text" placeholder="请填写专业名称" v-model="major"/>
			</view>
		</view>
		<!-- 学历 -->
		<view class="education">
			<view class="title">
				<text>*\t</text>
				Offer类型
			</view>
			<view class="type">
				<view @click="educationSelect(1)" :class="isUndergraduate?'selected':''">
					本科
				</view>
				<view @click="educationSelect(2)" :class="isMaster?'selected':''">
					硕士
				</view>
				<view @click="educationSelect(3)" :class="isDoctor?'selected':''">
					博士
				</view>
			</view>
		</view>
		<!-- 起止时间 -->
		<view class="time">
			<view class="title">
				<text>*\t</text>
				起止时间
			</view>
			<view class="time-select">
				<view @click="timeSelect" :class="startDate !== 'Y/M' ? 'selected':''">
					{{startDate}}
				</view>
				<view>
				</view>
				<view @click="timeSelect" :class="startDate !== 'Y/M' ? 'selected':''">
					{{endDate}}
				</view>
			</view>
		</view>
		
		<!-- 同意相关条款 -->
		<view style="height: 210upx;">
		
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;background-color: #FFFFFF;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);" v-if="!editFlag">
			<view class="confirm">
				<button @click="confirmAddEdu">确认添加</button>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="bottom-btn" v-if="editFlag">
			<button @click="deleteNotice">删除</button>
			<button @click="confirmAddEdu">保存</button>
		</view>
		<w-picker
			:visible.sync="rangeVisible"
			mode="range" 
			startYear="2000" 
			endYear="2030"
			:value="rangeVal"
			:current="true"
			@confirm="onConfirm($event,'range')"
			@cancel="onCancel"
			ref="range" 
		></w-picker>
		 <!-- 删除警告弹窗 -->
		 <uni-popup-sp ref="deletePopup" type="center">
		 	<view class="delete-notice">
		 		<view class="title">
		 			确认删除此教育认证？
		 		</view>
		 		<view class="notice">
		 			删除后将无法找回	
		 		</view>
		 		<view class="btngroup">
		 			<button type="default" @click="$refs.deletePopup.close()">取消</button>
		 			<button type="default" @click="deleteEdu">确认</button>
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
				isUndergraduate: false,
				isMaster: false,
				isDoctor: false,
				rangeVisible:false,
				result:{},
				startDate:'Y/M',
				endDate:'Y/M',
				// 条款是否选中
				isProvisionSelected: false,
				provisionPicSrc: '../../static/pic/me/ok.svg',
				school:'',
				major:'',
				// 学校是否在输入状态
				isSchoolInput:false,
				// logo列表
				logoList:[],
				baseUrl:'',
				// logo列表当前page
				currentPage:1,
				// 学校logo
				schoolIcon:'',
				// 编辑状态
				editFlag:false,
				// 教育经历的id
				EduId:0,
				// 教育经历内容
				EduInfo:{}
			}
		},
		methods: {
			// 条款选中
			educationSelect: function(i) {
				if (i === 1) {
					this.isUndergraduate = true
					this.isMaster = false
					this.isDoctor = false
				}
				if (i === 2) {
					this.isMaster = true
					this.isUndergraduate = false
					this.isDoctor = false
				}
				if (i === 3) {
					this.isUndergraduate = false
					this.isMaster = false
					this.isDoctor = true
				}
			},
			// 时间选择函数
			timeSelect: function() {
				this.rangeVisible = true
			},
			onConfirm(res,type){
				this.result=res;
				console.log(res)
				// 切割日期保留年月
				this.startDate = res.value[0].substring(0,7)
				this.endDate = res.value[1].substring(0,7)
			},
			onCancel(){
				
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
			// 	确认提交点击
			confirmAddEdu:function(){
				if(this.school.match(/^[ ]*$/)){
					uni.showToast({
						title:'请填写学校名！',
						icon:'none'
					})
					return
				}
				if(this.major.match(/^[ ]*$/)){
					uni.showToast({
						title:'请填写专业！',
						icon:'none'
					})
					return
				}
				if(this.isUndergraduate === false && this.isDoctor === false && this.isMaster === false){
					uni.showToast({
						title:'请选择学历！',
						icon:'none'
					})
					return
				}
				if(this.startDate === 'Y/M'){
					uni.showToast({
						title:'请选择时间！',
						icon:'none'
					})
					return
				}
				this.checkTextSecurity()
				
			},
			// 匹配区域点击事件
			searchClick:function(){
				return
			},
			// 学校输入事件
			onSchoolInput:function(){
				this.schoolIcon = ''
				if(this.school.match(/^[ ]*$/)){
					this.isSchoolInput = false
					return
				}
				else{
					this.isSchoolInput = true
					this.searchLogo(10,1)
				}
			},
			// 搜索匹配点击
			searchItemClick:function(i){
				this.school = this.logoList[i].logoname
				this.schoolIcon = this.logoList[i].url
				this.isSchoolInput = false
			},
			// 跳转至条款
			switchToProvision:function(){
				uni.navigateTo({
					url:'../provision/provision'
				})
			},
			// 全局关闭搜索框
			closeSearchArea:function(){
				if(this.isSchoolInput === true){
					console.log('关闭搜索框')
					this.isSchoolInput = false
				}	
			},
			// 教育上传到服务器
			uploadEduToServer:function(){
				let that = this
				let education = ''
				if(this.isUndergraduate === true){
					education = '本科'
				}
				if(this.isMaster === true){
					education = '硕士'
				}
				if(this.isDoctor === true){
					education = '博士'
				}
				let data = {
					label:0,
					openId:this.$store.state.userOpenID,
					school:this.school,
					major:this.major,
					education:education,
					schoolPhoto:this.schoolIcon,
					startTime:this.startDate,
					endTime:this.endDate
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/addEducationExperience`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					that.updateUserinfo()
					uni.showToast({
						title:'添加成功！',
						success(res) {
							setTimeout(function() {
								that.switchToSuccess()
							}, 500);
						}
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 更新教育经历
			updateEdu:function(){
				let that = this
				let education = ''
				if(this.isUndergraduate === true){
					education = '本科'
				}
				if(this.isMaster === true){
					education = '硕士'
				}
				if(this.isDoctor === true){
					education = '博士'
				}
				let data = {
					id:this.EduId,
					label:0,
					openId:this.$store.state.userOpenID,
					school:this.school,
					major:this.major,
					education:education,
					schoolPhoto:this.schoolIcon,
					startTime:this.startDate,
					endTime:this.endDate
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/user/updateEducationExperience`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					that.updateUserinfo()
					uni.showToast({
						title:'修改成功！',
						success(res) {
							setTimeout(function() {
								that.switchToSuccess()
							}, 500);
						}
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 跳转至成功页
			switchToSuccess:function(){
				// relaunch，关闭当前所有页面
				uni.switchTab({
					url:'../profile/profile'
				})
			},
			// 搜索匹配logo
			searchLogo:function(pageSize,pageNum){
				let that = this
				this.$axios.request({
					url:`/Message/searchLogo`,
					method:'get',
					params:{
						name:this.school,
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
							that.isSchoolInput = false
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
			// 同步一次个人信息
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
			// 获取教育经历信息
			getEduInfo:function(id){
				let tmp = this.$store.state.userInfoPlatform.educationexperiences
				for(let i = 0;i<tmp.length;i++){
					if(id == tmp[i].id){
						this.EduInfo = tmp[i]
						this.$nextTick(function(){
							this.drawEduInfo()
						})
						return
					}
				}
			},
			// 渲染教育
			drawEduInfo:function(){
				this.school = this.EduInfo.school
				this.major = this.EduInfo.major
				this.schoolIcon = this.EduInfo.schoolPhoto
				this.startDate = this.EduInfo.startTime
				this.endDate = this.EduInfo.endTime
				if(this.EduInfo.education === '本科'){
					this.isUndergraduate = true
				}
				if(this.EduInfo.education === '硕士'){
					this.isMaster = true
				}
				if(this.EduInfo.education === '博士'){
					this.isDoctor = true
				}
			},
			// 删除教育经历的前置提示
			deleteNotice:function(){
				this.$refs.deletePopup.open()
			},
			// 删除教育经历
			deleteEdu:function(){
				let that = this
				this.$axios.request({
					url:`/user/deleteEducationExperience`,
					method:'get',
					params:{
						id:this.EduId,
					}
				}).then(function({data}){
					console.log(data)
					// 更新个人缓存
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
			// 上传文本的安全校验
			checkTextSecurity:function(){
				let that = this
				let data = {
					text:this.organization+this.position
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url:`/wx/checkText`,
					method:'post',
					data
				}).then(function({data}){
					console.log(data)
					// 如果处于编辑状态则进入编辑提交函数
					if(that.editFlag){
						that.updateEdu()
					}
					else{
						that.uploadEduToServer()
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
		onLoad:function(options) {
			// 如果参数有id，切换编辑状态
			if(options.id){
				uni.setNavigationBarTitle({
					title: '编辑教育经历'
				})
				this.editFlag = true
				this.EduId = options.id
				this.getEduInfo(options.id)
			}
			this.baseUrl = this.$store.state.baseUrl
		}
	}
</script>

<style lang="less" scoped>
	// 学校
	.school {
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
			// 姓名输入框
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
	}
	
	.major{
		margin: 40upx 36upx;
		font-size: 24upx;
		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}
		// 姓名输入框
		input {
			background-color: #F2F2F2;
			padding: 18upx 24upx;
			border-radius: 20upx;
			margin-top: 10upx;
			z-index: 1;
		}
	}
	// 学历
	.education {
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
				padding: 18upx 32upx;
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

	// 起止时间
	.time {
		margin: 40upx 36upx;
		font-size: 24upx;

		// 标题
		.title {
			text {
				color: #00a29a;
			}
		}

		.time-select {
			display: flex;
			align-items: center;
			margin-top: 20upx;

			view {
				padding: 18upx 48upx;
				color: #BDBDBD;
				background-color: #f2f2f2;
				border-radius: 20upx;

				&:nth-child(2) {
					margin: 0 15upx;
					padding: 0;
					width: 24upx;
					height: 4upx;
					background-color: #E0E0E0;
				}
			}
			.selected{
				color: #828282;
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
	
	// 确认添加按钮样式
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
	
	// 底部固定双按钮
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
