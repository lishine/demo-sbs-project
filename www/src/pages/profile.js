import React from 'react'

import { Profile } from 'features/auth/profile/Profile'

const Page = () => <Profile />

Page.getInitialProps = async ({ store, isServer, pathname, query }) => {
    console.log('In Profile in getInitialProps')

    if (process.browser) {
        console.log('Profile BROWSER')
    } else {
        console.log('Profile SERVER')
    }

    return {}
}

export default Page
