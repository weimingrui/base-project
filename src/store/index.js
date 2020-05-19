/*
 * @Author: wyx
 * @Date: 2019-04-29 15:00:22
 * @Last Modified by: huapeng
 * @Last Modified time: 2020-03-06 09:42:33
 */

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

//全局store
import GlobalStore from "@/store/globalStore";
// import createPersistedState from "vuex-persistedstate";
// /**
//  * 所有数据存储在sessionStorage防止刷新store丢失
//  */
// const createdSession = createPersistedState({
//     key: "TZJC_SS",
//     storage: window.sessionStorage,
//     reducer: vuexState => {
//         let _glob = vuexState.GlobalStore;
//         return _glob;
//     }
// });
// /**
//  * 存储在localStorage 需要手动处理
//  */
// const createLocal = createPersistedState({
//     key: "TZJC_LS",
//     storage: window.localStorage,
//     reducer: vuexState => {
//         let _glob = vuexState.GlobalStore;
//         return {
//             MAPCENTER: _glob.MAPCENTER,
//             organizationName: _glob.organizationName,
//         };
//     }
// });

const store = new Vuex.Store({
    modules: {
        GlobalStore,
    },
    // plugins: [createdSession, createLocal]
});
export default store;