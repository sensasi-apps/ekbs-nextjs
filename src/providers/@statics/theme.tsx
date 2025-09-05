'use client'

import { createTheme } from '@mui/material/styles'
import Link from 'next/link'

const THEME = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
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
                component: Link,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: Link,
            },
        },
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
})

export default THEME
