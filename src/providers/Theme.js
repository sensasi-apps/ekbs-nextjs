import { forwardRef, useEffect, useMemo, useState } from 'react'
import { createTheme } from '@mui/material/styles'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline, useMediaQuery } from '@mui/material'
import Link from 'next/link'

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
    return <Link ref={ref} {...props} />
})

const ThemeProvider = ({ children }) => {
    const [colorMode, setColorMode] = useState(undefined)
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    useEffect(() => {
        const colorMode = localStorage.getItem('colorMode')

        if (colorMode) {
            setColorMode(colorMode)
        } else {
            setColorMode(prefersDarkMode ? 'dark' : 'light')
        }
    }, [prefersDarkMode])

    const toggleColorMode = () => {
        setColorMode(prevMode => {
            const newMode = prevMode === 'dark' ? 'light' : 'dark'

            localStorage.setItem('colorMode', newMode)

            return newMode
        })
    }

    const theme = useMemo(
        () =>
            createTheme({
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
                palette: {
                    mode: colorMode,
                    toggleColorMode,
                },
            }),
        [colorMode],
    )

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />

            {children}
        </MuiThemeProvider>
    )
}

export default ThemeProvider
