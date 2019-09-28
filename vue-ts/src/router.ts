import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout/Index.vue'
import axios from "./utils/http"

Vue.use(Router);

export const asyncRouterMap = [
  {
    path: '/register',
    name: 'register',
    component: () => import("./views/Login/Register.vue"),
    hidden: false,
    meta: { title: "注册账号" },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("./views/Login/Login.vue"),
    hidden: false,
    meta: { title: "系统登录" },
  },
  {
    path: '/password',
    name: 'password',
    component: () => import("./views/Login/Password.vue"),
    hidden: false,
    meta: { title: "找回密码" },
  },
  {
    path: '/confirmupdatepwd',
    name: 'confirmupdatepwd',
    component: () => import("./views/ConfirmUpdatePwd.vue"),
    hidden: false,
    meta: { title: "确认找回密码" },
  },
  {
    path: "/",
    name: "dashboard",
    component: Layout,
    redirect: "/home",
    hidden: true,
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("./views/Home.vue"),
        meta: { title: "首页", icon: "fa fa-home" }
      }
    ]
  },
  {
    path: "/dataManage",
    name: "dataManage",
    component: Layout,
    redirect: "/tableData",
    hidden: true,
    meta: { title: "数据管理", icon: "fa fa-database" },
    children: [
      {
        path: "/tableData",
        name: "tableData",
        component: () => import("./views/DataManage/TableData.vue"),
        meta: { title: "上传管理", icon: "fa fa-table" },
      },
      {
        path: "/chartsData",
        name: "chartsData",
        component: () => import("./views/DataManage/ChartsData.vue"),
        meta: { title: "图片上传", icon: "fa fa-bar-chart" },
      },
      {
        path: "/formData",
        name: "formData",
        component: () => import("./views/DataManage/FormData.vue"),
        meta: { title: "图片一览", icon: "fa fa-file-text-o" },
      }
    ]
  },
  {
    path: "/userManage",
    name: "userManage",
    component: Layout,
    redirect: "/accountData",
    hidden: true,
    children: [
      {
        path: "/accountData",
        name: "accountData",
        component: () => import("./views/UserManage/AccoutData.vue"),
        meta: { title: "账户管理", icon: "fa fa-user-plus" },
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/userInfo",
    hidden: false,
    children: [
      {
        path: "/userInfo",
        name: "userInfo",
        component: () => import("./views/UserManage/UserInfo.vue"),
        meta: { title: "个人中心" },
      }
    ]
  },
  {
    path: "/collections",
    component: Layout,
    redirect: "/myCollection",
    hidden: false,
    children: [
      {
        path: "/myCollection",
        name: "myCollection",
        component: () => import("./views/DataManage/Collections.vue"),
        meta: { title: "收藏夹" },
      }
    ]
  },
  {
    path: "/uploader",
    component: Layout,
    redirect: "/uploaderPage",
    hidden: false,
    children: [
      {
        path: "/uploaderPage",
        name: "uploaderPage",
        component: () => import("./views/DataManage/UploaderPage.vue"),
        meta: { title: "上传者主页" },
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    component: () => import("./views/404.vue"),
    hidden: false,
    meta: { title: "404" },
  },
  {
    path: "*",
    redirect: "404"
  }
]

const router: any = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: asyncRouterMap
})

// 路由拦截
router.beforeEach((to: any, from: any, next: any) => {
  // 判断token是否存在
  const isLogin = localStorage.tsToken ? true : false;
  if (to.path === "/login" || to.path === "/password" || to.path === "/register" || to.path === "/confirmupdatepwd") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router;
