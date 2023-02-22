import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//全局store
import GlobalStore from '@/store/globalStore'

const store = new Vuex.Store({
  modules: {
    GlobalStore
  }
})
export default store
