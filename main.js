import Vue from 'vue'
import App from './App'
// 引入vuex
import store from './store'
import qs from 'qs'
// 全局注册vuex
Vue.prototype.$store = store
Vue.prototype.$qs = qs

Vue.config.productionTip = false

App.mpType = 'app'

// 引入网络状态监听
import lib from './common/lib.js'
Vue.prototype.lib = lib

// 引入封装的axios
import Request from './js_sdk/pocky-request/pocky-request/index.js'
Vue.prototype.$axios = Request()

const app = new Vue({
	...App,
	lib
})
app.$mount()

// 
Vue.mixin({
    methods:{
        setTabBarIndex(index){
            if (typeof this.$mp.page.getTabBar === 'function' &&
                this.$mp.page.getTabBar()) {
                this.$mp.page.getTabBar().setData({
                    selected:index
                })
            }
        }
    }
})