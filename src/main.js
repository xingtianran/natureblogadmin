import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
// 饿了么ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from '@/layout/left-menu.vue'
import topView from '@/layout/top-view.vue'
import myUpload from 'vue-image-crop-upload/upload-2.vue';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)
Vue.use(ElementUI)

Vue.component("left-menu", leftMenu)
Vue.component("top-view", topView)
Vue.component("my-upload", myUpload)
import {checkUser} from '@/api/api'


router.beforeEach((to, from, next) => {
    // 如果跳转页面为登录页面
    if (to.path === '/login') {
        checkUser("/user/parse_token").then(result => {
            // 判断是否登录 1.登录的话，管理员转移到首页，用户转移到门户首页
            if (result.code === 20000) {
                // 管理员转移到首页，用户转移到门户首页
                if (result.data.roles === 'role_admin') {
                    next({path: '/'})
                } else {
                    window.location = "http://www.xtran.top"
                }
            } else {
                // 没有登录，直接放行
                next()
            }
        })
    } else if (to.path === '/init-admin') {
        next()
    } else {
        // 其他页面的话， 判断是否登录，登录而且是管理原的话，允许，其他用户跳转到门户
        checkUser("/user/parse_token").then(result => {
            // 判断是否登录 1.登录的话，管理员转移到首页，用户转移到门户首页
            if (result.code === 20000) {
                // 管理员转移到首页，用户转移到门户首页
                if (result.data.roles === 'role_admin') {
                    next()
                } else {
                    window.location = "http://www.xtran.top"
                }
            } else {
                // 没有登录，直接放行
                next({path: '/login'})
            }
        })
    }
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
