<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		console.log(uni.getStorageSync('userInfoPlatform'))
		if(uni.getStorageSync('userInfoPlatform')){
			// 存储平台信息
			let userInfoPlatform = uni.getStorageSync('userInfoPlatform')
			this.$store.commit('saveUserinfoPlatform',userInfoPlatform)
			this.$store.commit('updateAuthState')
			let that = this
			this.$axios.request({
				url:`/user/searchById`,
				method:'get',
				params:{
					openid:userInfoPlatform.user.openId
				}
			}).then(function({data}){
				console.log(data)
				//同步个人信息到store
				that.$store.commit('saveUserinfoPlatform',data.data)
			}).catch(err => {
				console.log(err)
			})
		}
		
		// 监听断网
		this.lib.Network.On()
	},
	onShow: function() { 
		console.log('App Show');
		// 登录时刷新token
		if(uni.getStorageSync('token')){
			this.$axios.request({
				url:`/user/refreshToken`,
				method:'get',
			}).then(function({data}){
				uni.setStorageSync('token', data.data.token)
			}).catch(err => {
				console.log(err)
			})
		}
	},
	onHide: function() {
		console.log('App Hide');
	},
};
</script>

<style>
image{
	well-change:transform
}
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
