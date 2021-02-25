// swiperDotBig.vue

<template>
	<view class="dot-main">
		<view :class="['dot-item',current==index?'active':'']" v-for="(item,index) in list" :key="index"></view>
	</view>
</template>
<style>
	.dot-main {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.dot-item {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin: 0 8upx;
		box-sizing: border-box;
		border: 1px solid #FFFFFF;
	}
	.active {
		background-color: #FFFFFF;
	}
</style>
<script>
	export default {
		props: [ 'list','current'],
		data() {
			return {
				
			};
		}
	}
</script>