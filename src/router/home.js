/**
 * Home
 */
export default [
    {
        path: '/',
        name: 'index',
        redirect: '/login',
        meta: {model: 'login'},
    },
    {
        name: 'login',
        path: '/login',
        component: resolve => require(['@/views/user/login'], resolve),
        meta: {model: 'login'},
    },
    {
        name: 'account_info',
        path: '/account/info',
        component: resolve => require(['@/views/account/info'], resolve),
        meta: {},
    },
];