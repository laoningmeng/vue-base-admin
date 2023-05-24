import Layout from '@/layout'
const userRouter = {
    path: '/user',
    component: Layout,
    redirect: 'list',
    name: 'User',
    meta: {
        title: '用户模块',
        icon: 'table',
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/user/index'),
            name: 'Staff',
            meta: { title: '人员模块',menu:'user' }
        },
  ]
}

export default userRouter