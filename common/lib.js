import Request from '../js_sdk/pocky-request/pocky-request/index.js';
import store from '../store/index.js'
// 网络状态监听
const Network = {
	isConnect:false,
	On(){
		let that = this
		uni.getNetworkType({
			success(res) {
				if(res.networkType!=='none'){
					that.isConnect = true
					return
				}
				uni.showToast({
					icon:'none',
					title:'无网络！'
				})
			}
		})
		uni.onNetworkStatusChange(function(res){
			that.isConnect = res.isConnected;
			if(!res.isConnected){
				uni.showToast({
					icon:'none',
					title:'网络连接断开！'
				})
			}
		})
	}
}

export default{
	Network
}