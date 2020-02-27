import { useState, useRef, useLayoutEffect } from 'react'
// const getViewDimensions = () => {
//     var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
//     var viewHeight = Math.max(
//         document.documentElement.clientHeight,
//         window.innerHeight || 0
//     )
//     return {
//         viewWidth: ,
//         viewHeight: ,
//     }
// }

export function getDimensionObject(node) {
    console.log('* node', node)
    const _rect = node.getBoundingClientRect()
    const viewWidth = document.documentElement.clientWidth
    const viewHeight = document.documentElement.clientHeight

    const rect = _rect.toJSON() || _rect
    const left = rect.left || rect.x
    const right = rect.right
    const top = rect.top || rect.y
    const bottom = rect.bottom
    return {
        width: rect.width,
        height: rect.height,
        top,
        left,
        x: rect.x || rect.left,
        y: rect.y || rect.top,
        right,
        bottom,
        fixed: {
            left,
            top,
            right: viewWidth - right,
            bottom: viewHeight - bottom,
        },
    }
}

// const dimensionsNotSetYet = dimensions => dimensions.top === undefined

export const useDimensions = (props = {}) => {
    const { track: _track } = props
    const ref = useRef()
    const [track, setTrack] = useState(_track)
    const [dimensions, setDimensions] = useState({ fixed: {} })

    useLayoutEffect(() => {
        if (ref.current) {
            console.log('*** ref.current', ref.current)
            const measure = () => {
                console.log('** ref.current', ref.current)

                window.requestAnimationFrame(() => {
                    console.log('* ref.current', ref.current)
                    if (ref.current) {
                        setDimensions(getDimensionObject(ref.current))
                    }
                })
            }
            measure()

            if (track) {
                window.addEventListener('resize', measure)
                window.addEventListener('scroll', measure)
            }

            return () => {
                if (track) {
                    window.removeEventListener('resize', measure)
                    window.removeEventListener('scroll', measure)
                }
            }
        }
    }, [ref.current, track])

    return [ref, dimensions, setTrack]
}
