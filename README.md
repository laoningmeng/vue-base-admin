# vue-base-admin

## 1. 环境准备

node: v14.17.3

```shell
npm install
npm run dev
```

## 2.使用

### 2.1 权限控制

* **接口返回值**

`/user/info` 接口返回值，这个接口里的`menus`，`btns`  用于权限判定

```json
{
    menus: ['user'],
    btns: ['admin','dashboard-title'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
```

* **按钮权限控制**

通过自定指令在组件上直接使用控制显示和隐藏

```vue
v-btn-auth="{name:'按钮名称'}"
```

使用

```vue
<div class="dashboard-text" v-btn-auth="{name:'dashboard-title'}">name: {{ name }}</div>
```

*  **菜单权限控制**

菜单的权限控制是在路由上的meta标签上做的，标有menu 的是需要控制权限的，没有的默认是大家都能访问的功能

```js
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
            meta: { title: '人员模块',menu:'user' } // 通过menu 这个key标记路由名字
        },
  ]
}
```



### 2.2 api 请求





