import Layout from '@/layout'
const userRouter = {
    path: '/user',
    component: Layout,
    redirect: 'list',
    name: 'User',
    meta: {
        title: '用户模块',
        icon: 'component',
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/user/index'),
            name: 'Staff',
            meta: { title: '人员管理',menu:'user', icon:'peoples' }
        },
        {
            path: 'department',
            component: () => import('@/views/department/index'),
            name: 'Staff',
            meta: { title: '部门模块',menu:'department', icon:'tree' }
        },
        {
            path: 'auth',
            component: () => import('@/views/auth/index'),
            name: 'Staff',
            meta: { title: '权限管理',menu:'auth',icon:'list' }
        },
  ]
}

export default userRouter