import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },
  {
    path: '/studysource',
    component: Layout,
    redirect: '/studysource/category',
    name: 'StudySource',
    meta: { title: '学习资源', icon: 'el-icon-collection' },
    children: [
      {
        path: 'category',
        name: 'StudySourceCategory',
        component: () => import('@/views/StudySource/Category'),
        meta: { title: '分类', icon: 'table' }
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('@/views/Video'),
        meta: { title: '视频', icon: 'el-icon-video-camera' }
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/Article'),
        meta: { title: '文章', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/set',
    component: Layout,
    redirect: '/set/appletconfig',
    name: 'Set',
    meta: { title: '系统配置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'appletconfig',
        name: 'AppletConfig',
        component: () => import('@/views/Set/AppletConfig'),
        meta: { title: '小程序配置', icon: 'el-icon-s-tools' }
      }, {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/Set/Log'),
        meta: { title: '操作日志', icon: 'el-icon-date' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
