import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * 注意：子菜单仅在路由子菜单时显示。长度>=1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                  如果设置为true，项将不会显示在侧边栏中（默认为false）
 * alwaysShow: true              如果设置为true，将始终显示根菜单
 *                               如果没有设置alwaysShow，
 *                               它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect          如果设置为noRedirect，则不会在面包屑中重定向
 * name:'router-name'            该名称由＜keep alive＞使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               名称显示在侧边栏和面包屑中（推荐集）
    icon: 'svg-name'/'el-icon-x' 侧边栏中显示的图标
    breadcrumb: false            如果设置为false，该项将隐藏在面包屑中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    // 登录
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    // 404
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    // 主页
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    // 用户
    path: '/control',
    component: Layout,
    redirect: '/control/supplierDispatchNote',
    name: 'Control',
    meta: { title: '操作', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'supplierDispatchNote',
        name: 'supplierDispatchNote',
        component: () => import('@/views/supplierDispatchNote/index'),
        meta: { title: '入货单', icon: 'table' }
      }, {
        path: 'deliver',
        name: 'Deliver',
        component: () => import('@/views/customerDispatchNote/index.vue'),
        meta: { title: '出货单', icon: 'table' }
      }, {
        path: 'SupplierInvoices',
        name: 'supplierInvoices',
        component: () => import('@/views/supplierOrder/index'),
        meta: { title: '采购单', icon: 'table' }
      }, {
        path: 'CustomerInvoices',
        name: 'customer Invoices',
        component: () => import('@/views/customerOrder/index.vue'),
        meta: { title: '客户订单', icon: 'table' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    redirect: '/list/table',
    name: 'Example',
    meta: { title: '用户', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/user/index'),
        meta: { title: '系统用户管理', icon: 'table' }
      }, {
        path: 'supplier',
        name: 'Supplier',
        component: () => import('@/views/supplier/index'),
        meta: { title: '供应商名册管理', icon: 'table' }
      }, {
        path: 'customer',
        name: 'Customer',
        component: () => import('@/views/customer/index'),
        meta: { title: '客户名册管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'material',
        component: () => import('@/views/material/index'),
        meta: { title: '物料信息', icon: 'form' }
      }
    ]
  }, {
    path: '/material_warehouse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'material_warehouse',
        component: () => import('@/views/material_warehouse/index'),
        meta: { title: '物料库存管理', icon: 'form' }
      }
    ]
  }, {
    path: '/product',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'product',
        component: () => import('@/views/product/index'),
        meta: { title: '产品信息', icon: 'form' }
      }
    ]
  },
  {
    path: '/product_warehouse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'product_warehouse',
        component: () => import('@/views/product_warehouse/index'),
        meta: { title: '产品库存管理', icon: 'form' }
      }
    ]
  }, {
    path: '/bom',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'BOM',
        component: () => import('@/views/bom/index'),
        meta: { title: '产品物料清单', icon: 'form' }
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
