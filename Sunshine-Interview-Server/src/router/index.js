import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import chooseFunction from '@/components/chooseFunction'
import addInformation from '@/components/addInformation'
import viewCertificate from '@/components/viewCertificate'
import searchVideo from '@/components/searchVideo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'choosefunction',
      component: chooseFunction
    },
    {
      path: '/addinformation',
      component: addInformation
    },
    {
      path: '/signin',
      component: main
    },
    {
      path: '/view',
      component: viewCertificate
    },
    {
      path: '/search',
      component: searchVideo
    }
  ]
})
