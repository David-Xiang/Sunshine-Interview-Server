import Vue from 'vue'
import Router from 'vue-router'
import signinTeacher from '@/components/signinTeacher'
import signinStudent from '@/components/signinStudent'
import signinSchool from '@/components/signinSchool'
import chooseFunction from '@/components/chooseFunction'
import addInformation from '@/components/addInformation'
import viewCertificate from '@/components/viewCertificate'
import searchVideo from '@/components/searchVideo'
import watchVideo from '@/components/watchVideo'

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
      path: '/signinStudent',
      component: signinStudent
    },
    {
      path: '/signinTeacher',
      component: signinTeacher
    },
    {
      path: '/signinSchool',
      component: signinSchool
    },
    {
      path: '/view',
      component: viewCertificate
    },
    {
      path: '/search',
      component: searchVideo
    },
    {
      path: '/watch',
      component: watchVideo
    }
  ]
})
