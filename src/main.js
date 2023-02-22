/*
 * @Author: Arthur
 * @Date: 2020-05-18 19:26:40
 * @LastEditors: Arthur
 * @LastEditTime: 2020-05-19 15:55:17
 * @Description: file content
 */

import Vue from 'vue'
import App from './App.vue'
import routes from '@/router'
import 'babel-polyfill'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.config.productionTip = false

console.log(process.env.NODE_ENV)

Vue.use(VueRouter)
let router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'selected',
  strict: process.env.NODE_ENV !== 'production'
})
router.beforeEach((to, from, next) => {
  if (to.query.isSameMeta) {
    to.meta.mName = from.meta.mName
  }
  if (to.query.reMetaName) {
    to.meta.mName = to.query.reMetaName
  }

  next()
})
function getAbsolutePath() {
  let path = location.pathname
  return path.substring(0, path.lastIndexOf('/') + 1)
}
const IE11RouterFix = {
  methods: {
    hashChangeHandler: function() {
      this.$router.push(
        window.location.hash.substring(1, window.location.hash.length)
      )
    },
    isIE11: function() {
      return !!window.MSInputMethodContext && !!document.documentMode
    }
  },
  mounted: function() {
    if (this.isIE11()) {
      window.addEventListener('hashchange', this.hashChangeHandler)
    }
  },
  destroyed: function() {
    if (this.isIE11()) {
      window.removeEventListener('hashchange', this.hashChangeHandler)
    }
  }
}
new Vue({
  store,
  base: getAbsolutePath(),
  router,
  mixins: [IE11RouterFix],
  render: (h) => h(App)
}).$mount('#app')
