const Router = require('nextjs-dynamic-routes')

const router = new Router()

// const isPublicRoute = route => publicRoutes.find(r => r === route)
const findPage = page => {
    return router.routes.find(r => r.page === page)
}
const getRouteName = pathname => {
    const { name } = findPage(pathname) || {}
    return name
}
// const isPublicPage = page => {
//     const { name } = findPage(page) || {}
//     return name && isPublicRoute(name)
// }

router
    // .add({
    // name: 'home',
    // pattern: '/',
    // page: '/',
    // })
    .add({
        name: 'profile',
        pattern: '/profile',
        page: '/profile',
        public: true,
    })
    .add({
        name: 'registerDevice',
        pattern: '/manage/device/register/:deviceName?',
        page: '/manage/device/register',
    })
    .add({
        name: 'manageDevices',
        pattern: '/manage/devices',
        page: '/manage/devices',
    })
    .add({
        name: 'manageDevice',
        pattern: '/manage/device/:deviceName',
        page: '/manage/device',
    })
    .add({
        name: 'editDevice',
        pattern: '/manage/device/edit/:deviceName',
        page: '/manage/device/edit',
    })
    .add({
        name: 'manageUsers',
        pattern: '/manage/users',
        page: '/manage/users',
    })
    .add({
        name: 'manageUser',
        pattern: '/manage/user/:userId',
        page: '/manage/user',
    })
    .add({
        name: 'editUser',
        pattern: '/manage/user/edit/:userId',
        page: '/manage/user/edit',
    })
    .add({
        name: 'createUser',
        pattern: '/manage/users/create',
        page: '/manage/users/create',
    })
    .add({
        name: 'monitorEvents',
        pattern: '/monitor/events',
        page: '/monitor/events',
    })

const roleRoutes = {
    OWNER: ['profile', 'registerDevice', 'manageDevice', 'editDevice', 'manageDevices'],
}

const isRouteEnable = ({ route, role, deviceCount }) => {
    if (role === 'COMPANY_CENTER') {
        return true
    } else {
        const ret = roleRoutes[role] && roleRoutes[role].includes(route)
        if (role === 'OWNER' && route !== 'registerDevice') {
            return ret && deviceCount > 0
        } else {
            return ret
        }
    }
}

module.exports = { router, findPage, getRouteName, isRouteEnable }
