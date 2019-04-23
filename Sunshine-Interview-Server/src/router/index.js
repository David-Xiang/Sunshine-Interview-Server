import Vue from 'vue'
import Router from 'vue-router'
import chooseFunction from '@/components/chooseFunction'
import addInformation from '@/components/addInformation'
import viewCertificate from '@/components/viewCertificate'
import searchVideo from '@/components/searchVideo'
import watchVideo from '@/components/watchVideo'
import signinStudent from '@/components/signinStudent'
import signinTeacher from '@/components/signinTeacher'
import signinSchool from '@/components/signinSchool'
import downloadInfo from '@/components/downloadInfo'

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
    },
    {
      path: '/download',
      component: downloadInfo
    }
  ]
})
