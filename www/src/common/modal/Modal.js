// Node-modules
import React, { useState } from 'react'
import { css, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import ReactModal from 'react-modal'

// Common
import { Box, Flex } from 'styles/ss-components'
import { boxCss } from 'styles/ss-utils'
import { ButtonClose } from 'svg/ButtonClose'
import { mediaUp, mediaDown } from 'styles/utils'

ReactModal.setAppElement('#__next')

export const Modal = ({
    style,
    Trigger,
    children,
    className,
    isModalOpen,
    closeModal,
    openModal,
    controlled,
    onClosing,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false)
    let onClickClose
    let _onClickClose
    let onClickOpen
    if (controlled) {
        _onClickClose = closeModal
        onClickOpen = openModal
    } else {
        _onClickClose = () => setIsOpen(false)
        onClickOpen = () => setIsOpen(true)
    }
    if (onClosing) {
        onClickClose = () => {
            _onClickClose()
            onClosing()
        }
    } else {
        onClickClose = _onClickClose
    }

    return (
        <div>
            {Trigger &&
                React.cloneElement(Trigger, {
                    onClick: onClickOpen,
                })}
            <ClassNames>
                {({ css, cx }) => (
                    <ReactModal
                        ariaHideApp={false}
                        isOpen={controlled ? isModalOpen : isOpen}
                        onRequestClose={onClickClose}
                        className={cx(
                            css(_defaultContentCss),
                            css(...boxCss(props)),
                            className
                        )}
                        overlayClassName={cx(css(_overlayCss))}
                    >
                        <>
                            <_CloseButton aria-label="Close" onClick={onClickClose}>
                                <span aria-hidden="true">
                                    <ButtonClose />
                                </span>
                            </_CloseButton>
                            {typeof children === 'function'
                                ? children({ onClickClose })
                                : React.cloneElement(children, { onClickClose })}
                        </>
                    </ReactModal>
                )}
            </ClassNames>
        </div>
    )
}

const _CloseButton = styled(Box)(
    boxCss.css({
        zIndex: 1000000,
        cursor: 'pointer',
        position: 'absolute',
        display: 'block',
        top: '16px',
        iie: '+16px',
        [mediaUp('md')()]: {
            iie: '-16px',
            top: '-16px',
        },
    })
)

const _defaultContentCss = css`
    position: relative;
`

const _overlayCss = css`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 0;
    overflow: auto;
    background-color: white;
    /* background-color: rgba(0, 0, 0, 0.8); */
    background-color: rgba(0, 0, 0, 0.2);
`
