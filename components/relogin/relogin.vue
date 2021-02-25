<template>
	<view>
		
	</view>
</template>

<script>
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	export default{
		name: 'relogin',
		data() {
			return {
			}
		},
		methods:{
			openLoginPopup:function(){
				this.$refs.relogin.open()
			}
		},
	}
</script>

<style lang="less">
	.relogin{
		width: 446upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
	}
</style>
