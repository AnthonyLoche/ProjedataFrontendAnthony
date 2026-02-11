// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { AdminLayout, BlankLayout } from '@/layouts'
import { Views } from '@/views'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true }, 
    children: [
      {
        path: 'dashboard',
        component:  Views.DashboardView,
        meta: {
          title: 'Dashboard',
          description: 'Visão geral e métricas do sistema',
          breadcrumbs: [{ title: 'Dashboard', disabled: false, href: '/' }],
        },
      },
      {
        path: 'rawmaterial',
        component:  Views.RawMaterialView,
        meta: {
          title: 'Matérias Primas',
          description: 'Dashboard de Gerenciamento das Matérias Primas',
          breadcrumbs: [{ title: 'Dashboard', disabled: false, href: '/rawmaterial' }],
        },
      },
       {
        path: 'products',
        component:  Views.ProductsView,
        meta: {
          title: 'Produtos',
          description: 'Dashboard de Gerenciamento dos Produtos',
          breadcrumbs: [{ title: 'Dashboard', disabled: false, href: '/products' }],
        },
      },
       {
        path: 'orders',
        component:  Views.ProductsView,
        meta: {
          title: 'Pedidos',
          description: 'Dashboard de Gerenciamento dos Pedidos',
          breadcrumbs: [{ title: 'Dashboard', disabled: false, href: '/orders' }],
        },
      },
    ],
  },
  {
    path: '/blank',
    component: BlankLayout,
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

