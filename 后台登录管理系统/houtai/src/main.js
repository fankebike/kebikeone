import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//  导入axios
import axios from 'axios'
//  Vue.use(axios)
// Vue.use(VueAxios)
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import jq from 'jquery'
import { MessageBox } from 'element-ui'
// 树形列表导入
import TreeTable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// import VueAxios from 'vue-axios'
// 网络加载条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// axios请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置挂载在vue原型对象上
Vue.prototype.$Axios = axios
Vue.config.productionTip = false
Vue.prototype.$query = jq
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
// 请求数据koken无效/数据拦截器/NProgress.start()网络加载条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.done()
  return config
})
// 网络加载条拦截器
// axios.interceptors.response.use((config => {
//   NProgress.done()
//   return config
// })
// 时间数字串拼接,时间过滤器 dateFormat过滤器的名字 originVal需要被处理的事件的名字
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // y年，m月d日。hh小时。mm分钟
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 所有时间拼接方式
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
