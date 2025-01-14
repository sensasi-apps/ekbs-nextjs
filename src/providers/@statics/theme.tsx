import type { LinkProps } from 'next/link'
import { forwardRef } from 'react'
import { createTheme } from '@mui/material'
import Link from 'next/link'

const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(
    function LinkBehaviour(props, ref) {
        return <Link {...props} ref={ref} />
    },
)

const THEME = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
    },
    colorSchemes: {
        light: {
            palette: {
                background: {
                    default: '#f8f7f4',
                },
            },
        },
        dark: true,
    },
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehaviour,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehaviour,
            },
        },
    },
})

export default THEME
