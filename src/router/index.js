/*
 * @Author: Arthur
 * @Date: 2020-05-19 15:44:32
 * @LastEditors: Arthur
 * @LastEditTime: 2020-05-19 15:52:13
 * @Description: file content
 */

import HelloWorld from '@/components/HelloWorld.vue'
import RouteView from '@/components/router-view.vue'
import Layout from '@/components/layout.vue'
const router = [
  {
    path: '/',
    component: Layout,
    base: '/',
    children: [
      {
        path: '/module_name',
        component: RouteView,
        children: [
          {
            path: '/module_name/home',
            component: HelloWorld
          }
        ]
      }
    ]
  }
]
export default router
