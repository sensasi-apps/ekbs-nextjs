import { forwardRef, useContext, useMemo } from 'react'
import { createTheme } from '@mui/material/styles'

import AppContext from '@/providers/App'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import Link from 'next/link'

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
    return <Link ref={ref} {...props} />
})

const ThemeProvider = ({ children }) => {
    const { themeColorMode } = useContext(AppContext)

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
                    mode: themeColorMode,
                },
            }),
        [themeColorMode],
    )

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />

            {children}
        </MuiThemeProvider>
    )
}

export default ThemeProvider
