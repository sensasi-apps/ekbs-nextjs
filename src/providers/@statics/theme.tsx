'use client'

import { createTheme } from '@mui/material/styles'
import Link from 'next/link'

const THEME = createTheme({
    colorSchemes: {
        dark: true,
        light: {
            palette: {
                background: {
                    default: '#f8f7f4',
                },
            },
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: Link,
            },
        },
        MuiLink: {
            defaultProps: {
                component: Link,
            },
        },
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
})

export default THEME
