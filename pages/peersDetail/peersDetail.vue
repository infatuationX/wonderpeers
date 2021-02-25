<template>
	<view id="peersDetail">
		<!-- 一日总 -->
		<view class="detail" v-for="(item,i) in peersDetail" :key="i">
			<!-- 日期 -->
			<view class="date">
				{{item.time}}
			</view> 
			<!-- 收益 -->
			<view class="income" v-for="(itemDetail,j) in item.detail" :key="j" v-if="itemDetail.cost !== 0">
				<text>{{itemDetail.title}}</text>
				<view>

				</view>
				<text :style="itemDetail.cost>0?'color:#00A29A':'color: #EF7474;'">{{itemDetail.cost>0?`+${itemDetail.cost}`:`${itemDetail.cost}`}}</text>
				<image src="../../static/pic/detail/peers.png" mode=""></image>
			</view>
		</view>
		<view style="height: 136upx;">
			
		</view>
		<!-- 底部联系客服 -->
		<view class="bottom-button">
			<button open-type="contact">
				<image src="../../static/pic/detail/help-circle-outline.png" mode=""></image>
				豆子问题，联系客服
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				peersDetail: []
			}
		},
		methods:{
			// 获取豆子流水详情
			getPeersDetail:function(){
				let that = this
				this.$axios.request({
					url:`/Message/searchBill`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID
					}
				}).then(function({data}){
					console.log(data)
					console.log(data.data)
					that.rebuildDetail(data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 将流水重构
			rebuildDetail:function(data){
				let tempdate = ''
				// 长度为0不计算，防止栈溢出
				if(data.length ===0){
					return
				}
				// 循环判断日期，相同日期流水压入一个数组
				for(let i =0;i<data.length;i++){
					// 第一个日期跳过
					if(i === 0){
						tempdate = data[i].time.substring(0,10)
						this.peersDetail.push({
							time:data[i].time.substring(0,10),
							detail:[data[i]]
						})
						continue
					}
					// 日期相同时，不新加元素，在当前数组中加入流水
					if(tempdate === data[i].time.substring(0,10)){
						this.peersDetail[this.peersDetail.length-1].detail.push(data[i])
					}
					// 日期不同时，新开一天，加入数组
					else{
						tempdate = data[i].time.substring(0,10)
						this.peersDetail.push({
							time:data[i].time.substring(0,10),
							detail:[data[i]]
						})
					}
				}
				console.log(this.peersDetail)
			},
			// 刷新用户的缓存
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
			
		}, 
		onLoad:function(){
			this.getPeersDetail()
			// 更新一次用户数据
			this.updateUserinfo()
		}
	}
</script>

<style lang="less" scoped>
	.detail {
		margin: 36upx;
		font-size: 24upx;

		// 日期
		.date {
			color: #BDBDBD;
		}

		// 收益
		.income {
			display: flex;
			align-items: center;
			margin: 32upx 0;

			text {
				&:nth-child(1) {
					flex-shrink: 0;
					max-width: 500upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				&:nth-child(3) {
					flex-shrink: 0;
					margin-right: 10upx;
				}
			}

			view {
				border: 1px dashed #E0E0E0;
				width: 100%;
				margin: 0 10upx;
			}

			image {
				margin-left: auto;
				flex-shrink: 0;
				width: 32upx;
				height: 24upx;
			}
		}
	}

	// 底部联系客服
	.bottom-button {
		height: 136upx;
		width: 100%;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		button {
			display: flex;
			align-items: center;
			font-size: 20upx;
			color: #00A29A;
			justify-content: center;
			background-color: #FFFFFF;

			image {
				width: 30upx;
				height: 30upx;
				margin-right: 5upx;
			}

			&::after {
				border: none;
			}
		}
	}
</style>
