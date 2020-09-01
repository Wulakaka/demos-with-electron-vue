import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/PageMain').default,
      children: [
        {
          path: 'landing',
          name: 'landing-page',
          component: require('@/components/LandingPage').default
        },
        {
          path: 'canvas',
          name: 'canvas-page',
          component: require('@/components/CanvasPage').default
        },
        {
          path: 'spritejs',
          name: 'spritejs-page',
          component: require('@/components/PageSprite').default
        },
        {
          path: 'templateDesigner',
          name: 'page-tempalate-designer',
          component: require('@/components/PageTemplateDesigner').default
        },
        {
          path: 'templateDisplayer',
          name: 'page-tempalate-displayer',
          component: require('@/components/PageTemplateDisplayer').default
        },
        {
          path: 'customConstructor',
          name: 'page-custom-constructor',
          component: require('@/views/CustomConstructor').default
        },
        {
          path: 'emptyPage',
          name: 'EmptyPage',
          // component: () => import('@/views/EmptyPage.vue')
          component: () => Promise.resolve(require('@/views/EmptyPage.vue'))
        },
        {
          path: '*',
          redirect: 'landing'
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
