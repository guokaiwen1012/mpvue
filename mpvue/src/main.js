import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

// 引入全局vuex
import store from "./store/store"
Vue.prototype.$store = store

//引入数据请求
import http from "./http/http"
Vue.prototype.$axios = http

const app = new Vue(App)
app.$mount()

//全局挂载globalData 在.vue通过set : that.globalData.对象名称 = 对象值  get : that.globalData.对象名称
Vue.prototype.globalData = getApp().globalData
