/*
 * @Author: wyx 
 * @Date: 2019-04-29 15:00:03 
 * @Last Modified by: hp
 * @Last Modified time: 2019-09-03 09:32:38
 */
import Store from '@/store/index.js';
class Auth {

    //验证权限
    /**
     * 
     * @param {*} permissions //用户所拥有权限['*']如果唯一*为不限权限
     * @param {*} permission  //当前节点需要验证的权限字符串
     */
    static hasPermission(permission) {
        let hasPermission = false;
        let routerKey = 'tc_RouterAuthList_' + this.getGJ();
        let routerAuthListStr = localStorage.getItem(routerKey);
        let permissions = ['*'];
        if (routerAuthListStr) {
            permissions = JSON.parse(routerAuthListStr);
        }

        if (permission != '*' && !permissions.includes(permission) && permissions[0] != '*') {

            // router.go(-1);
        } else {
            hasPermission = true;
        }

        return hasPermission;
    }
    static getGJ() {
        let curr = localStorage.getItem('tc_currCity') ? JSON.parse(localStorage.getItem('tc_currCity')) : '';
        let _name = curr ? curr.name : '';
        let _pathName = window.location.pathname.replace(/\//g, '');
        if (!_pathName) {
            _pathName = _name;
        }
        return _pathName;
    }
    //登录
    static loginIn(currentCity, sToken) {
        localStorage.setItem('tc_currCity', JSON.stringify(currentCity));
        localStorage.setItem('tc_sToken_' + currentCity.name, sToken);
        Store.commit('GlobalStore/setMapCenter', currentCity.center);
        //跳转到首页
        if (process.env.NODE_ENV == 'production') {
            if (process.env.VUE_APP_JG == 'wanke') {
                if (process.env.VUE_APP_ENVS == 'ga') {
                    window.location.href = 'http://' + window.location.host + '/#/';
                } else {
                    window.location.href = 'http://' + window.location.host + '/' + currentCity.name + '/#/';
                }
            } else {
                window.location.href = 'http://' + window.location.host + '/' + currentCity.name + '/#/';
            }
        } else {
            window.location.href = 'http://' + window.location.host + '/#/';
        }
    }

    //登出
    static loginOut() {
        let curr = localStorage.getItem('tc_currCity') ? JSON.parse(localStorage.getItem('tc_currCity')) : '';
        let _name = curr ? curr.name : '';
        localStorage.removeItem('tc_currCity');
        localStorage.removeItem('tc_gl_sToken');
        localStorage.removeItem('tc_sToken_' + _name);
        let routerKey = 'tc_RouterAuthList_' + this.getGJ();
        localStorage.setItem(routerKey, '');
        Auth.toLoginIn();
    }

    //拿到本地Token
    static getToken() {
        let curr = localStorage.getItem('tc_currCity') ? JSON.parse(localStorage.getItem('tc_currCity')) : '';
        let _name = curr ? curr.name : '';
        let _pathName = window.location.pathname.replace(/\//g, '');
        if (!_pathName) {
            _pathName = _name;
        }
        let sToken = localStorage.getItem('tc_sToken_' + _pathName);
        return sToken;
    }

    /**
     * 退出登录
     */
    static toLoginIn() {
        if (process.env.NODE_ENV == 'production') {

            if (process.env.VUE_APP_JG == 'wanke') {
                if (process.env.VUE_APP_ENVS == 'ga') {
                    window.location.href = 'http://' + window.location.host + '/#/login';
                } else {
                    window.location.href = 'http://' + window.location.host + '/' + currentCity.name + '/#/login';
                }

            } else {
                window.location.href = 'http://' + window.location.host + '/login/#/';
            }

        } else {
           
            window.location.href = 'http://' + window.location.host + '/#/login';
        }
      
    }
}

export default Auth;