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
import contactUs from '../components/contactUs'

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
      component: addInformation,
      meta:{
        reqTeacherLogin:true
      }
    },
    {
      path: '/signinStudent',
      name: 'signinStudent',
      component: signinStudent
    },
    {
      path: '/signinTeacher',
      name: 'signinTeacher',
      component: signinTeacher
    },
    {
      path: '/signinSchool',
      name: 'signinSchool',
      component: signinSchool
    },
    {
      path: '/view',
      component: viewCertificate,
      meta:{
        reqStudentLogin:true
      }
    },
    {
      path: '/search',
      component: searchVideo,
      meta:{
        reqSchoolLogin:true
      }
    },
    {
      path: '/watch',
      component: watchVideo,
      meta:{
        reqSchoolLogin:true
      }
    },
    {
      path: '/download',
      component: downloadInfo,
    },
    {
      path: '/contact',
      component: contactUs
    }
  ]
})
