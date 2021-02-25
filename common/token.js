import Request from '../js_sdk/pocky-request/pocky-request/index.js';

export default {
    // 获取 模拟token
	
	refreshToken(token){
		return Request().request({
            url: '/user/refreshToken',
            method: 'get',
            header: {token},
        })
	}

};