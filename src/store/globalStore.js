/*
 * @Author: Arthur
 * @LastEditors: Arthur
 * @Description: 
 * @Date: 2019-05-09 13:51:08
 * @LastEditTime: 2020-05-19 16:11:17
 */

const GlobalStore = {
    namespaced: true,
    state: {
        theme: '',
        requrstQueue: [],
    },
    mutations: {
        //设置主题
        setTheme(state, theme) {
            state.theme = theme;
        },
        //设置请求队列
        setRequrstQueue(state, requrstQueue) {
            state.requrstQueue = requrstQueue;
        },
    },


    actions: {
        // ===============================================  set Actions  =============================================
        //设置主题 
        setTheme(cotext, theme) {
            cotext.commit('setTheme', theme);
        },
        //增加请求
        addToRequrstQueue(context, requrstQueue) {
            let arr = JSON.parse(JSON.stringify(context.state.requrstQueue));
            arr.push('.');
            context.commit('setRequrstQueue', [...arr]);
        },

        //较少请求
        removeFromRequrstQueue(context, requrstQueue) {
            let arr = JSON.parse(JSON.stringify(context.state.requrstQueue));
            arr.pop();
            context.commit('setRequrstQueue', arr);
        },
    }
}

export default GlobalStore;