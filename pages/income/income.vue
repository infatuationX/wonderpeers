<template>
	<view>
		<!-- 收益卡片 -->
		<view  style="position: fixed;width: 100%;background-color: #FFFFFF;">		
		<view class="incomeCard">
			<!-- 底部logo -->
			<image src="../../static/pic/fontpage/logo.svg" mode="" class="peers"></image>
			<!-- 底部文字logo -->
			<image src="../../static/pic/detail/wonderpeers-svg.svg" mode=""  class="logo-text"></image>
			<view class="time">
				从{{incomeDetail[0].timestamp.substring(0,10)}}至今
			</view>
			<view class="publish">
				共发布干货 <text>{{incomeDetail.length}}</text> 条
			</view>
			<view class="people-peers">
				<view>
					共解锁人数<text>{{unlockNum}}</text>人
				</view>
				<view>
					共收获豆子<text>{{peerIncome}}</text>个
				</view>
			</view>
		</view>
		<!-- 收益标题 -->
		<view class="income-title">
			<view>
			</view>
			<text>收益明细</text>
			<view>
			</view>
		</view>
		</view>
		<view style="height: 600upx;">
			
		</view>
		<!-- 收益明细 -->
		<view class="income-detail" v-for="(item,i) in incomeDetail" :key="i">
			<view class="date">
				{{item.timestamp.substring(0,10)}}
			</view>
			<view class="detail">
				<text>{{item.title}}</text>
				<!-- 中间连线 -->
				<view class="line">
					
				</view>
				<!-- 数量 -->
				<view class="num">
					<image src="../../static/pic/fontpage/people.svg" mode=""></image>
					<text>× {{item.unlockNum}}</text>
					<image src="../../static/pic/fontpage/logo.svg" mode=""></image>
					<text>× {{item.allCost}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				incomeDetail:[],
				unlockNum:0,
				peerIncome:0,
			}
		},
		methods:{
			// 获得收益明细
			getIncomeList:function(){
				let that = this
				this.$axios.request({
					url:`/Message/searchAllcost`,
					method:'get',
					params:{
						openid:this.$store.state.userOpenID,
					}
				}).then(function({data}){
					console.log(data)
					that.incomeDetail = data.data
					that.count(data.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 计算数量
			count:function(data){
				for(let i =0;i<data.length;i++){
					this.unlockNum += data[i].unlockNum
					this.peerIncome += data[i].allCost
				}
			}
		},
		onLoad:function() {
			this.getIncomeList()
		}
	}
</script>

<style lang="less" scoped>
	// 收益卡片
	.incomeCard{
		margin: 36upx;
		border-radius: 20upx;
		background: linear-gradient(287.02deg, #00A29A -11.51%, rgba(218, 241, 240, 0.145833) 77.93%, rgba(255, 255, 255, 0) 100%), #00A29A;
		height: 450upx;
		position: relative;
		overflow: hidden;
		// 图片logo
		.peers{
			width: 90%;
			height: 90%;
			position: absolute;
			right: -120upx;
			bottom: -80upx;
			mix-blend-mode: lighten;
		}
		// 文字logo
			
		.logo-text{
			position: absolute;
			width: 260upx;
			height: 24upx;
			bottom: 27upx;
			right: 27upx;
		}
		.time{
			color: #FFFFFF;
			letter-spacing: -0.3px;
			font-size: 24upx;
			margin: 30upx 0 0 40upx;
		}
		.publish{
			font-size: 32upx;
			color: #FFFFFF;
			font-weight: bold;
			margin: 20upx 0 0 40upx;
			letter-spacing: -0.3px;
			text{
				font-size: 100upx;
				margin: 0 10upx;
			}
		}
		.people-peers{
			font-size: 24upx;
			color: #FFFFFF;
			margin: 40upx 0 0 40upx;
			letter-spacing: -0.3px;
			display: flex;
			text{
				font-size: 52upx;
				margin: 0 10upx;
			}
			view{
				&:nth-child(2){
					margin-left: 60upx;
				}
			}
		}
	}
	// 收益标题
	.income-title{
		margin: 40upx 36upx;
		display: flex;
		align-items: center;
		justify-content: center;
		text {
			color: #00A29A;
			font-size: 28upx;
			font-weight: 500;
			margin: 0 22upx;
			flex-shrink: 0;
		}
		
		view {
			width: 100%;
			height: 2upx;
			background-color: #00A29A;
		}
	}
	// 收益明细
	.income-detail{
		margin: 10upx 36upx ;
		font-size: 24upx ;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.date{
			color: #BDBDBD;
		}
		.detail{
			margin: 20upx 0;
			display: flex;
			align-items: center;
			text{
				color: #333333;
				flex-shrink: 0;
			}
			.line{
				width: 100%;
				border: 1px dashed #E0E0E0;
				margin: 0 10upx;
			}
			.num{
				margin-left: auto;
				display: flex;
				align-items: center;
				flex-shrink: 0;
				image{
					width: 36upx;
					height: 26upx;
					&:nth-child(3){
						margin-left: 24upx;
						width: 48upx;
						height: 32upx;
					}
				}
				text{
					color: #333333;
				}
			}
		}
	}
</style>
