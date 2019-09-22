import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import axios from "./utils/http"
import formatDate from "./utils/formatDate"

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.formatDate = formatDate;
Vue.prototype.staticSrc = "http://localhost:5000" // 服务端静态资源公共路径

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
