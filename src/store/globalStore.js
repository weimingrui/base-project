/*
 * @Author: Arthur
 * @LastEditors: Arthur
 * @Description: 
 * @Date: 2019-05-09 13:51:08
 * @LastEditTime: 2020-05-19 15:37:57
 */

const GlobalStore = {
    namespaced: true,
    state: {
        theme: '',
    },
    mutations: {
        //设置主题
        setTheme(state, theme) {
            state.theme = theme;
        },
    },


    actions: {
        // ===============================================  set Actions  =============================================
        //设置主题 
        setTheme(cotext, theme) {
            cotext.commit('setTheme', theme);
        },
    }
}

export default GlobalStore;