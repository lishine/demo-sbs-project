import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const StyledSelect = styled.select`
    padding-inline-start: 8px;
    width: 100%;
    height: 3em;
    border-radius: var(--border-radius);
    background: grey;
    text-align: start;
    color: darkgreen;
    border: '1px solid #ccc';
    &:focus {
        outline: 0;
        box-shadow: none;
        border: 2px solid var(--color, #b2c6ff);
        color: var(--onwhite-normal);
    }
    border: 1px solid var(--onwhite-border);
    color: var(--onwhite-muted);
    &::placeholder {
        color: currentColor;
    }
`
