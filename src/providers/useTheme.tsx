import type { PaletteMode } from '@mui/material'
import type { LinkProps } from 'next/link'

import Link from 'next/link'
import { FC, forwardRef, useEffect, useMemo, useState, ReactNode } from 'react'
import { createTheme } from '@mui/material/styles'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(
    function LinkBehaviour(props, ref) {
        return <Link {...props} ref={ref} />
    },
)

export let toggleColorMode = () => {}

const ThemeProvider: FC<{
    children: ReactNode
}> = ({ children }) => {
    const [colorMode, setColorMode] = useState<PaletteMode>('light')

    useEffect(() => {
        const colorMode = localStorage.getItem('colorMode')

        if (colorMode && ['light', 'dark'].includes(colorMode)) {
            setColorMode(colorMode as PaletteMode)
        } else {
            const prefersDarkMode = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches

            setColorMode(prefersDarkMode ? 'dark' : 'light')
        }

        toggleColorMode = () => {
            setColorMode(prevMode => {
                const newMode = prevMode === 'dark' ? 'light' : 'dark'

                localStorage.setItem('colorMode', newMode)

                return newMode
            })
        }
    }, [])

    const theme = useMemo(
        () =>
            createTheme({
                components: {
                    MuiLink: {
                        defaultProps: {
                            // TODO: fix this
                            // @ts-ignore
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
