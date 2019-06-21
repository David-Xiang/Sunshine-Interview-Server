// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import './lib/jquery-vender.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'
import generatePdf from './components/utils/generatePdf'
import globalVar from './components/utils/globalVar'
import Video from 'video.js'
import 'video.js/dist/video-js.css'

Vue.prototype.$video = Video

Vue.prototype.$globalVar = globalVar

Vue.use(generatePdf)
Vue.use(ElementUI)
window.eventBus = new Vue()

Vue.config.productionTip = false

router.beforeEach((to, from, next)=>{
  if (to.name === "signinSchool" && sessionStorage.getItem("loginState") === "school")
    next({
      path:"/search"
    });
  else if (to.name === "signinTeacher" && sessionStorage.getItem("loginState") === "teacher")
    next({
      path:"/addInformation"
    });
  else if (to.name === "signinStudent" && sessionStorage.getItem("loginState") === "student")
    next({
      path:"/view"
    });

  else if (to.meta.reqSchoolLogin && sessionStorage.getItem("loginState") !== "school")
    next({
      path:"/signinSchool",
    });
  else if (to.meta.reqTeacherLogin && sessionStorage.getItem("loginState") !== "teacher")
    next({
      path:"signinTeacher",
    });
  else if (to.meta.reqStudentLogin && sessionStorage.getItem("loginState") !== "student")
    next({
      path:"/signinStudent",
    });
  else
    next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
