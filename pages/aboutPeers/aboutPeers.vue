<template>
	<view id="aboutPeers">
		<view class="detail" v-for="(item,i) in detail" :key = "i">
			<!-- 标题 -->
			<view class="title">
				<!-- logo -->
				<image src="../../static/pic/fontpage/logo-small.png" mode=""></image>
				<text :decode="true">{{item.title}}</text>
			</view>
			<view class="content">
				{{item.content}}
			</view>
			
		</view>
		<!-- 底部固定按钮 -->
		<view class="bottom">
			<button open-type="contact">联系客服</button>
			<button @click="backTo">返回</button>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				detail:[
					{
						title:' 豆子是什么？',
						content:'- 豆子是豌豆派小程序内部使用的虚拟货币，可用于解锁平台内容~ 如何获取豆子？'
					},
					{
						title:' 如何获取豆子',
						content:'- 如果你是新用户，第一次使用豌豆派小程序、绑定手机号、实名认证、个人信息完善等，都可以获得相应数额的豆子呐~ \n - 如果你是老用户，每日签到、评论内容、邀请新用户，也可以获得豆子噢~ \n - 详情可以咨询咱们小豌豆客服哟~'
					},
					{
						title:' 解锁内容不满意可以退还豆子吗？',
						content:'- 内容一经解锁，不支持取消解锁哦~因此豆子用出去之后就不会再退还啦'
					},
					{
						title:' 豆子可以花钱购买吗？',
						content:'- 豆子暂不支持人民币购买，如果上线人民币购买功能将第一时间通知到大家嗷~？'
					}
				]
			}
		},
			
		methods:{
			backTo:function(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	// 具体条款
	.detail{
		margin: 34upx;
		// 标题
		.title{
			display: flex;
			align-items: center;
			image{
				width: 40upx;
				height: 30.6upx;
			}
			text{
				font-size: 28upx;
				color: #333333;
				font-weight: 600;
			}
		}
		.content{
			margin-top: 10upx;
			color: #4F4F4F;
			font-size: 24upx;
		}
	}
	
	// 底部固定按钮
	.bottom{
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
