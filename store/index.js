import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		// 请求基础地址
		baseUrl:'https://www.wonderpeers.com:8080',
		// 是否登陆
		isLogin:false,
		// 用户openid
		userOpenID:'',
		// 用户平台数据
		userInfoPlatform:{},
		// 是否授权
		isAuthorize:false,
		// 临时数据，用于更新本地的点赞情况
		tempIsCollect:false,
		tempIsUnlock:false,
		tempNum:0,
		// 左右分区
		tempArea:'',
		// 临时收藏数量
		tempColNum:0,
		// 是否新人
		newPeople:false,
		// 解锁列表
		unlockList:'',
		// 收藏列表
		collectList:'',
		// 发布列表
		publishList:'',
		// 关注列表
		followList:'',
		// 401重新登录flag
		reloginFlag:false
	},
    mutations: {
		// 保存平台存储的用户数据
		saveUserinfoPlatform(state,payload){
			state.userInfoPlatform = payload
			state.userOpenID = payload.user.openId
			state.isLogin = true
			uni.setStorageSync('userInfoPlatform',payload)	
		},

		// 更新签到日期
		updateSignDate(state,payload){
			state.userInfoPlatform.user.signTime = payload	
			uni.setStorageSync('userInfoPlatform',state.userInfoPlatform)
		},
		// 更新授权状态
		updateAuthState(state){
			state.isAuthorize = true
		},
		// 更新临时数据,同步主页的点赞解锁状态
		updateTempState(state,payload){
			state.tempIsCollect=payload.tempIsCollect
			state.tempIsUnlock=payload.tempIsUnlock
			state.tempNum=payload.tempNum
			state.tempArea=payload.tempArea
			state.tempColNum = payload.tempColNum
		},
		// 下三为设置临时存储的面经解锁,点赞,点赞数更新
		updateTempUnlock(state,payload){
			state.tempIsUnlock = payload
		},
		updateTempCollect(state,payload){
			state.tempIsCollect = payload
		},
		updateTempCollectNum(state,payload){
			state.tempColNum += payload
		},
		// 更新本地头像
		updateAvatar(state,payload){
			state.userInfoPlatform.user.userPot = payload
		},
		// 更新本地昵称
		updateUsername(state,payload){
			state.userInfoPlatform.user.userName = payload
		},
		// 是否新人更新
		updateNewpeople(state,payload){
			state.newPeople = true
		},
		// 获取解锁列表更新
		updateUnlockList(state,payload){
			state.unlockList = payload
		},
		// 获取收藏列表更新
		updateCollectList(state,payload){
			state.collectList = payload
		},
		// 获取发布列表更新
		updatePublishList(state,payload){
			state.publishList = payload
		},
		// 获取关注列表更新
		updateFollowList(state,payload){
			state.followList = payload
		},
		// 用户收藏数量更新
		updateUserCollectNum(state,payload){
			state.userInfoPlatform.user.collectionNum += payload
		},
		// 用户解锁数量更新
		updateUserUnlockNum(state,payload){
			state.userInfoPlatform.user.unlockNum += payload
		},
		// 用户发布数量更新
		updateUserPublishNum(state,payload){
			state.userInfoPlatform.user.issueNum += payload
		},
		// 用户关注数量更新
		updateUserFollowNum(state,payload){
			state.userInfoPlatform.user.followNum += payload
		},
		// 用户豆子数量更新
		updateUserBeanNum(state,payload){
			state.userInfoPlatform.user.bean += payload
		},
		// 用户权限更新
		updateUserAuthorization(state,payload){
			state.userInfoPlatform.user.isLockCollection = payload.isLockCollection
			state.userInfoPlatform.user.isLockFollow = payload.isLockFollow
		},
		updateRelogin(state,payload){
			state.reloginFlag = payload
		}
	},
    actions: {}
})
export default store