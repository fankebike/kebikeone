import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件（导入主页到路由模块，Login相当于将主页改为名为Login的组件）
import Login from '../components/Login.vue'
import From from '../components/From.vue'
import userLi from '../components/userName/userLi.vue'
import Welcome from '../components/Welcome.vue'
import PowerLi from '../components/PowerLi.vue'
import Part from '../components/part.vue'
import Shopping from '../components/shopClass.vue'
import Parm from '../components/parmClass.vue'
import ShopList from '../components/shopList.vue'
import AddShop from '../components/AddShop.vue'
import Order from '../components/order.vue'
import ECharts from '../components/ECharts.vue'
// 引入全局样式
import '../assets/css/global.css'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
  // 路由重定向：当路径中出现/,则自动定位跳转到/login这个路径上的网页
    { path: '/', redirect: '/login' },
    // { path: '/', redirect: '/from' },
    // 新增路由规则，当客户访问/login路径时自动跳转到名为Login这个组件（网页）
    { path: '/login', component: Login },
    {
      path: '/from',
      component: From,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/user', component: userLi },
        { path: '/root-li', component: PowerLi },
        { path: '/part', component: Part },
        { path: '/shopClass', component: Shopping },
        { path: '/class', component: Parm },
        { path: '/shop', component: ShopList },
        { path: '/shop/addShop', component: AddShop },
        { path: '/order', component: Order },
        { path: '/charts', component: ECharts }
      ]
    }
  ]
})
// const router = new VueRouter({
// 路由导航守卫：防止客户通过url进入本需要有权限（没有登录注册）的页面
router.beforeEach((to, from, next) => {
  //   如果访问的是登录页，直接放行
  if (to.path === '/login') return next()
  //  拿到令牌数据
  var toke = window.sessionStorage.getItem('token')
  //  没有有令牌时
  if (!toke) { next('/login') }
  // 有令牌数据时，直接放行
  next()
})
//  mode: 'hash'
//  routes;

export default router
