// node_modules
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import styledSystemCss from '@styled-system/css'
import {
    typography,
    border,
    flexbox,
    layout,
    size,
    position,
    space,
    color,
    shadow,
    style,
    grid,
} from 'styled-system'
import { system, get as styledSystemGet } from '@styled-system/core'

// Common
import { map, omitProps, pick, omit } from 'utils/utils'

// Local
import { mediaDown, mediaUp } from 'styles/utils'
import { theme } from 'styles/theme'

// const themed = key => props => props.theme[key]

// --------------------------------- Extra propeties

const clipPath = style({
    prop: 'clipPath',
    key: 'clipPaths',
    transformValue: n => n,
})

const notmobile = props =>
    props.notmobile && { [mediaDown('md')(props)]: { display: 'none' } }
notmobile.propTypes = { notmobile: PropTypes.bool }

const onlymobile = props =>
    props.onlymobile && { [mediaUp('md')(props)]: { display: 'none' } }
onlymobile.propTypes = { onlymobile: PropTypes.bool }

// -------------------------------------------------
// Box Extra Params -------------------------------
// -------------------------------------------------

export const transform = style({
    prop: 'transform',
})

export const mirorIfRTL = style({
    prop: 'mirorIfRTL',
    cssProperty: 'transform',
    transformValue: () => theme.direction === 'rtl' && 'scaleX(-1)',
})

const visibility = style({
    prop: 'visibility',
})

const cursor = style({
    prop: 'cursor',
})

const pointerEvents = style({
    prop: 'pointerEvents',
})

const isNumber = n => typeof n === 'number' && !isNaN(n)
const getWidth = (n, scale) =>
    styledSystemGet(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + '%')

const direction = style({
    prop: 'direction',
})

const iis = style({
    prop: 'iis',
    cssProperty: theme.direction === 'rtl' ? 'right' : 'left',
    key: 'space',
})
const iie = style({
    prop: 'iie',
    cssProperty: theme.direction === 'rtl' ? 'left' : 'right',
    key: 'space',
})

const pis = style({
    prop: 'pis',
    cssProperty: 'paddingInlineStart',
    key: 'space',
})
const pie = style({
    prop: 'pie',
    cssProperty: 'paddingInlineEnd',
    key: 'space',
})

const mis = style({
    prop: 'mis',
    cssProperty: 'marginInlineStart',
    key: 'space',
})
const mie = style({
    prop: 'mie',
    cssProperty: 'marginInlineEnd',
    key: 'space',
})

const w = style({
    prop: 'w',
    cssProperty: 'width',
    key: 'sizes',
    transformValue: getWidth,
})
const h = style({
    prop: 'h',
    cssProperty: 'height',
    key: 'sizes',
    transformValue: getWidth,
})

// -------------------------------------------------
// Text Extra Params -------------------------------
// -------------------------------------------------

const noBaselineShift = style({
    prop: 'noBaselineShift',
    cssProperty: 'transform',
    transformValue: n => 'translateY(0)',
})

const dark = style({
    prop: 'dark',
    cssProperty: 'color',
    transformValue: n => 'var(--dark-normal)',
})

const light = style({
    prop: 'light',
    cssProperty: 'color',
    transformValue: _ => 'var(--light-normal)',
})

const whiteSpace = style({
    prop: 'whiteSpace',
    cssProperty: 'white-space',
})

const text = ({ text }) =>
    text &&
    {
        menu: {
            fontFamily: 'Oswald, sans-serif',
            fontSize: '14px',
            lineHeight: '24px',
            fontWeight: 400,
        },
    }[text]

const extraParamsObject = {
    whiteSpace,
    mirorIfRTL,
    direction,
    iis,
    iie,
    mis,
    mie,
    pis,
    pie,
    w,
    h,
    pointerEvents,
    notmobile,
    onlymobile,
    cursor,
    visibility,
    transform,
    clipPath,
    text,
    dark,
    light,
    noBaselineShift,
}

const paramsObject = {
    ...extraParamsObject,
    layout,
    flexbox,
    typography,
    border,
    shadow,
    size,
    position,
    space,
    color,
    grid,
}
export const boxParamsArray = Object.values(paramsObject)

export const boxCss = props => boxParamsArray.map(func => func(props))

boxCss.blacklist = Object.entries(paramsObject).map(([key, value]) => key)
boxCss.filter = props => pick(boxCss.blacklist)(props)
boxCss.omit = props => omit(boxCss.blacklist)(props)
boxCss.omitProps = component => omitProps(boxCss.blacklist)(component)
boxCss.toClassName = component => styled(boxCss.omitProps(component))(boxParamsArray)

const traverse = (o, fn) => {
    for (var i in o) {
        fn.apply(this, [i, o[i], o])
        if (o[i] !== null && typeof o[i] === 'object') {
            traverse(o[i], fn)
        }
    }
}

boxCss.css = fnOrObj => {
    return styledSystemCss(props => {
        const isFn = typeof fnOrObj === 'function'
        const obj = isFn ? fnOrObj(props) : fnOrObj
        traverse(obj, (k, v, o) => {
            const e = extraParamsObject[k]
            if (e) {
                const g = e({ theme, [k]: v })
                delete o[k]
                Object.assign(o, g)
            }
        })
        return obj
    })
}

boxCss.media = (media, obj) => {
    boxParamsArray.map(func => ({
        [media || '@media screen']: func({ theme, ...obj }),
    }))
}
