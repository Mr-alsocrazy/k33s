import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import AsideBox from './components/AsideBox.vue'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$baseURL = 'http://10.251.255.227:9090'

Vue.use(ElementUI)

Vue.component('AsideBox', AsideBox)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
