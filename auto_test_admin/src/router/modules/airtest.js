import Layout from '@/layout'

const airtestRouter = [
  {
    path: '/airtest/airs',
    component: Layout,
    children: [
      {
        path: '/airtest/airs',
        name: 'airs',
        component: () => import('@/views/airtest/airs'),
        meta: { title: '脚本列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/airtest/devices',
    component: Layout,
    children: [
      {
        path: '/airtest/devices',
        name: 'devices',
        component: () => import('@/views/airtest/devices'),
        meta: { title: '设备列表', icon: 'guide' }
      }
    ]
  },
  {
    path: '/airtest/tasks',
    component: Layout,
    children: [
      {
        path: '/airtest/tasks',
        name: 'tasks',
        component: () => import('@/views/airtest/tasks'),
        meta: { title: '任务列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/airtest/analysis',
    component: Layout,
    children: [
      {
        path: '/airtest/analysis',
        name: 'analysis',
        component: () => import('@/views/airtest/analysis'),
        meta: { title: '对比分析', icon: 'list' },
        hidden: true
      }
    ]
  }
]

export default airtestRouter
