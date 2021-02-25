<template>
	<view id="test">
		<relogin :flag="true"></relogin>
	</view>
</template>

<script>
	import relogin from '../../components/relogin/relogin.vue'
	export default {
		components:{
			relogin
		},
		data(){
			return{
				
			}
		},
		methods:{
			
		},
		onLoad:function() {
		}
	}
</script>

<style lang="less">
	#test{
		margin-top: 200upx;
	}
	
</style>
