import Interceptor from "./core/interceptor";
import Request from "./index";
import TokenApi from "../../../common/token.js"
import store from '../../../store/index.js'

export const globalInterceptor = {
	request: new Interceptor(),
	response: new Interceptor()
};

/**
 * 全局配置
 * 只能配置 静态数据
 * `content-type` 默认为 application/json
 * `header` 中`content-type`设置特殊参数 或 配置其他会导致触发 跨域 问题，出现跨域会直接进入响应拦截器的catch函数中
 */
export const config = {
	baseURL: "https://www.wonderpeers.com:8080",
	header: {
		// 'X-Auth-Token': 'xxxx',
		contentType: "application/x-www-form-urlencoded"
		// 'Content-Type': 'application/json'
	}
};

/**
 * 全局 请求拦截器, 支持添加多个拦截器
 * 例如: 配置token、添加一些默认的参数
 *
 * `return config` 继续发送请求
 * `return false` 会停止发送请求，不会进入错误数据拦截，也不会进入请求对象中的catch函数中
 * `return Promise.reject('xxxxx')` 停止发送请求, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} config 发送请求的配置数据
 */
globalInterceptor.request.use(
	(config) => {
		console.log("is global request interceptor");
		getToken() && (config.header.Authorization = 'Bearer' + getToken());
		return config;
	},
	(err) => {
		console.error("is global fail request interceptor: ", err);
		return false;
	}
);

/**
 * 全局 响应拦截器, 支持添加多个拦截器
 * 例如: 根据状态码选择性拦截、过滤转换数据
 *
 * `return res` 继续返回数据
 * `return false` 停止返回数据，不会进入错误数据拦截，也不会进入catch函数中
 * `return Promise.reject('xxxxx')` 返回错误信息, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} res 请求返回的数据
 * @param {Object} config 发送请求的配置数据
 * @return {Object|Boolean|Promise<reject>}
 */
let refreshFlag = false
globalInterceptor.response.use(
	(res, config) => {
		const code = parseInt(res.data.code);

		if (200 <= code && code < 400) { // 20x ~ 30x
			return res;
		} else if (code == 401) { // token 验证失败, 要求重新登录
		if(refreshFlag === false){
			console.log('登录过期')
			console.log(store.state.reloginFlag)
			store.commit('updateRelogin',true)
			refreshFlag = true
			setTimeout(function() {
				refreshFlag = false
			}, 500);
		}
		} else {
			uni.showToast({
				title: res.data.message,
				icon: 'none'
			})
			return Promise.reject(res, config);
		}
	}, (err, config) => {
		console.error('is global response fail interceptor');
		console.error('err: ', err)
		console.error('config: ', config)
		const {
			errMsg,
			data
		} = err;

		return Promise.reject({
			errMsg,
			data,
			config
		});
	},
);


// 获取缓存token
function getToken() {
	return uni.getStorageSync('token');
}

// 存储token到缓存
function saveToken(token) {
	uni.setStorageSync('token', token);
}

// 刷新token

// async function getApiToken() {
// 	let token = getToken()
// 	console.log(token)
//     let res = await refreshToken(token)
// 	console.log('进入刷新token了' + res)
// 	saveToken(res.data)
//     return res.data 
// }

// 刷新token
function refreshToken() {
	return Request().request({
		url: `/user/refreshToken`,
		method: 'get',
		header: {
			Authorization: 'Bearer' + getToken()
		}
	}).then(function({
		data
	}) {
		uni.setStorageSync('token', data.data.token);
		return data.data.token;
	})
}
/** 
 * 处理 http状态码
 * @param {object} o
 * @param {object} o.data 请求返回的数据
 * @param {object} o.config 本次请求的config数据
 * @param {string|number} o.code http状态码
 * @return {object|Promise<reject>}
 */


// 显示消息提示框
function showToast(data) {
	uni.showToast({
		title: JSON.stringify(data),
		icon: 'none',
		duration: 2000
	});
}
