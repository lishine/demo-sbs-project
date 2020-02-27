import React, { useState, useEffect } from 'react'
import _JsonTree from 'react-json-tree'
import isNumber from 'lodash/isNumber'
import { translate } from 'utils/langugae'

export const JsonTree = ({ data }) => {
    return (
        <_JsonTree
            theme={{
                tree: {
                    border: 0,
                    padding: 0,
                    paddingLeft: '10px',
                    marginTop: '0.5em',
                    marginBottom: '0.5em',
                    marginLeft: '0.125em',
                    marginRight: 0,
                    listStyle: 'none',
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none',
                    backgroundColor: 'white',
                },
            }}
            labelRenderer={raw => {
                if (isNumber(raw[0])) {
                    return raw[0] + 1
                } else {
                    return translate(raw[0])
                }
            }}
            valueRenderer={raw => {
                return ` ${raw.replace(/"/g, '')}`
            }}
            getItemString={(type, data, itemType, itemString) => {
                // console.log('itemType', itemType)
                // console.log('itemString', itemString)
                return <span />
            }}
            data={data}
            hideRoot
            shouldExpandNode={() => true}
        />
    )
}
