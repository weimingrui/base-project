/*
 * @Author: wyx 
 * @Date: 2019-04-29 14:39:12 
 * @Last Modified by: huapeng

 * @Last Modified time: 2020-03-13 11:23:13
 */



import axios from 'axios';
import Config from '@/serve/env.js';
import store from '@/store/index.js';
// import Auth from '@/utils/Auth.js';
// import ElementUI from 'element-ui';

let myHttp = axios.create({
    baseURL: Config.apiPath,
    timeout: 60000,
    headers: {
        'Content-Type': `application/json; charset=utf-8`,
        // 'fjdpversion': process.env.VUE_APP_ENVS  //正式需要取消注释
    },
    withCredentials: true,

});

// 添加请求拦截器
myHttp.interceptors.request.use(function (config) {

    if (!config.noLoading) {
        store.dispatch('GlobalStore/addToRequrstQueue');
    }

    let data = config.data || {};
    // 在发送请求之前做些什么
    if (data.iExportFlag) {
        // 下载文件操作
        config.responseType = 'blob';
    }
    // if (config.baseURL == Config.fileUrl) {
    //     delete config.headers.fjdpversion
    // }
    // // 判断是否存在token，如果存在则每个http header都加上token
    // let jwtToken = Auth.getToken();
    // if (jwtToken && !config.noToken) {
    //     config.headers.Authorization = `Bearer ${jwtToken}`;
    // }
    
    // //不同的token
    // if (config.tokenName) {
    //     config.headers.Authorization = localStorage.getItem('tc_gl_sToken');
    // }
    return config;

}, function (error) {

    store.dispatch('GlobalStore/removeFromRequrstQueue');

    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myHttp.interceptors.response.use(function (response) {

    //token过期
    if (response.data.code && response.data.code == 300001) {
        store.dispatch('GlobalStore/removeFromRequrstQueue');

        // if (process.env.NODE_ENV == 'production') {
        //     window.location.href = 'http://' + window.location.host + '/login/#/';
        // } else {
        //     window.location.href = 'http://' + window.location.host + '/#/login';
        // }
        Auth.toLoginIn();
        return response;
    }

    if (response.config.responseType !== 'blob') {
        // if (typeof (response.data.status) != "undefined" && !response.data.status) {
        //     ElementUI.Message.error(response.data.data || '出现错误，请稍后再试');
        // }
        // if (typeof (response.data.iError) != "undefined" && response.data.iError !== 0) {
        //     ElementUI.Message.error(response.data.data || '出现错误，请稍后再试');
        // }
    }

    if (!response.config.noLoading) {
        store.dispatch('GlobalStore/removeFromRequrstQueue');
    }
    // 对响应数据做点什么
    return response;
}, function (error) {

    store.dispatch('GlobalStore/removeFromRequrstQueue');
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default class MYHTTP {

    static get({
        url = '',
        params = {},
        config = {}
    }) {
        return myHttp.get(url, Object.assign({}, {
            params: params
        }, config));
    }
    static post({
        url = '',
        params = {},
        config = {}
    }) {
        return myHttp.post(url, params, config);
    }

    static upload({
        url = '',
        params = {},
        config = {}
    }) {
        return myHttp.post(url, params, Object.assign({
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }, config));
    }

}