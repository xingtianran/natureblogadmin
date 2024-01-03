import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


// 登录页面
const login = () => import("@/page/login/login-content.vue")
const initAdmin = () => import("@/page/init/init-admin.vue")
// 内容页面
const articleManage = () => import("@/page/content/manage-article.vue")
const postArticle = () => import("@/page/content/post-article.vue")
const commentManage = () => import("@/page/content/manage-comment.vue")
const imageManage = () => import("@/page/content/manage-image.vue")
//
// // 仪表盘页面
const index = () => import("@/page/dashboard/index.vue")

// 运营页面
const categoryManage = () => import("@/page/operation/manage-category.vue")
const loopManage = () => import("@/page/operation/manage-loop.vue")

// 设置页面
const friendLink = () => import("@/page/setting/friend-link.vue")
const websiteInfo = () => import("@/page/setting/website-info.vue")

// 用户页面
const consumerEmail = () => import("@/page/consumer/consumer-email.vue")
const consumerInfo = () => import("@/page/consumer/consumer-info.vue")
const consumerList = () => import("@/page/consumer/consumer-list.vue")

const baseView = () => import("@/layout/base-view.vue")
const rightView = () => import("@/layout/right-view.vue")

export const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children:
            [
                {
                    path: '/index',
                    name: '首页',
                    icon: 'el-icon-s-home',
                    meta:{
                        keepAlive: true,
                        menuIndex: '0'
                    },
                    hidden: false,
                    component: index
                },
                {
                    path: '/content',
                    name:'内容',
                    icon: 'el-icon-s-promotion',
                    hidden: false,
                    component: rightView,
                    children: [
                        {
                            path: 'manage-article',
                            name: '文章管理',
                            icon: 'el-icon-folder-opened',
                            meta:{
                                keepAlive: true,
                                parentName: '内容',
                                menuIndex: '1-0'
                            },
                            hidden: false,
                            component: articleManage
                        },
                        {
                            path: 'manage-comment',
                            name: '评论管理',
                            icon: 'el-icon-chat-line-square',
                            meta:{
                                keepAlive: true,
                                parentName: '内容',
                                menuIndex: '1-1'
                            },
                            hidden: false,
                            component: commentManage
                        },
                        {
                            path: 'manage-image',
                            name: '图片管理',
                            icon: 'el-icon-picture-outline-round',
                            meta:{
                                keepAlive: true,
                                parentName: '内容',
                                menuIndex: '1-2'
                            },
                            hidden: false,
                            component: imageManage
                        },
                        {
                            path: 'post-article',
                            name: '文章发表',
                            icon: 'el-icon-edit',
                            meta:{
                                keepAlive: true,
                                parentName: '内容',
                                menuIndex: '1-3'
                            },
                            hidden: false,
                            component: postArticle
                        }
                    ]
                },
                {
                    path: '/consumer',
                    name: '用户',
                    icon: 'el-icon-user-solid',
                    hidden: false,
                    component: rightView,
                    children: [
                        {
                            path: 'consumer-list',
                            name: '用户列表',
                            icon: 'el-icon-document',
                            meta:{
                                keepAlive: true,
                                parentName: '用户',
                                menuIndex: '2-0'
                            },
                            hidden: false,
                            component: consumerList
                        },
                        {
                            path: 'consumer-info',
                            name: '用户信息',
                            icon: 'el-icon-postcard',
                            meta:{
                                keepAlive: true,
                                parentName: '用户',
                                menuIndex: '2-1'
                            },
                            hidden: false,
                            component: consumerInfo
                        },
                        {
                            path: 'consumer-email',
                            name: '用户邮箱',
                            icon: 'el-icon-folder-checked',
                            meta:{
                                keepAlive: true,
                                parentName: '用户',
                                menuIndex: '2-2'
                            },
                            hidden: false,
                            component: consumerEmail
                        }
                    ]
                },
                {
                    path: '/operation',
                    name: '运营',
                    icon: 'el-icon-bicycle',
                    hidden: false,
                    component: rightView,
                    children: [
                        {
                            path: 'manage-category',
                            name: '分类管理',
                            icon: 'el-icon-edit-outline',
                            meta:{
                                keepAlive: true,
                                parentName: '运营',
                                menuIndex: '3-0'
                            },
                            hidden: false,
                            component: categoryManage
                        },
                        {
                            path: 'manage-loop',
                            name: '轮播图管理',
                            icon: 'el-icon-film',
                            meta:{
                                keepAlive: true,
                                parentName: '运营',
                                menuIndex: '3-1'
                            },
                            hidden: false,
                            component: loopManage
                        }
                    ]
                },
                {
                    path: '/setting',
                    name: '设置',
                    icon: 'el-icon-setting',
                    hidden: false,
                    component: rightView,
                    children: [
                        {
                            path: 'friend-link',
                            name: '友情链接',
                            icon: 'el-icon-connection',
                            meta:{
                                keepAlive: true,
                                parentName: '设置',
                                menuIndex: '4-0'
                            },
                            hidden: false,
                            component: friendLink
                        },
                        {
                            path: 'website-info',
                            name: '网站信息',
                            icon: 'el-icon-cpu',
                            meta:{
                                keepAlive: true,
                                parentName: '设置',
                                menuIndex: '4-1'
                            },
                            hidden: false,
                            component: websiteInfo
                        }
                    ]
                }
            ]
    },
    {
        path: '/login',
        hidden: true,
        component: login
    },
    {
        path: '/init-admin',
        hidden: true,
        component: initAdmin
    }
]

const router = new VueRouter({
    mode: 'history',
    routes // (缩写) 相当于 routes: routes
})

export default router