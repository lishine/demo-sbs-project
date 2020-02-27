import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { Box } from 'styles/ss-components'

const Index = () => <div />
// {/* <Box position="fixed" left="50%" top="50%" /> */}

Index.getInitialProps = async ({ store, isServer, pathname, query }) => {
    console.log('in index in getInitialProps')

    if (process.browser) {
        console.log('Index BROWSER')
    } else {
        console.log('Index SERVER')
    }

    return {}
}

export default Index
