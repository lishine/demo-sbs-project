import { useState, useRef, useEffect } from 'react'
// import { useDimensions, getDimensionObject } from './useDimensions'

export const usePopup = (props = {}) => {
    const { clickAnywhereToClose } = props
    const ref = useRef()
    const refTrigger = useRef()
    const [state, setState] = useState(false)
    // const [refTrigger, triggerDimensions, setTrack] = useDimensions({ track })
    // const [refTrigger] = useDimensions({ track })

    const toggleOpen = () => setState(!state)

    function handleEsc(e) {
        console.log('e', e)
        if (e.keyCode === 27) {
            if (state) {
                setState(false)
            }
        }
    }

    function handleCloseEvent(e) {
        console.log('handling event', e)
        if (state && ref && ref.current && refTrigger.current) {
            if (
                (clickAnywhereToClose || !ref.current.contains(e.target)) &&
                !refTrigger.current.contains(e.target)
            ) {
                setTimeout(() => setState(false), 200)
            }
        }
    }

    useEffect(() => {
        if (state) {
            // setTrack(track)
            document.addEventListener('keydown', handleEsc)
            document.addEventListener('mousedown', handleCloseEvent)
            document.addEventListener('touchstart', handleCloseEvent)

            return () => {
                // setTrack(false)
                document.removeEventListener('keydown', handleEsc)
                document.removeEventListener('mousedown', handleCloseEvent)
                document.removeEventListener('touchstart', handleCloseEvent)
            }
        }
    }, [state])

    console.log('state', state)
    return [
        ref,
        refTrigger,
        state,
        toggleOpen,
        // track
        //     ? triggerDimensions
        //     : (refTrigger &&
        //           refTrigger.current &&
        //           getDimensionObject(refTrigger.current)) || {
        //           fixed: {},
        //       },
    ]
}
