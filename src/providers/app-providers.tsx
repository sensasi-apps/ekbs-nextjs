// types
import type { ReactNode } from 'react'
// vendors
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
// providers
// statics
import THEME from '@/providers/@statics/theme'
// parts
import SWRProvider from './_parts/swr-provider'
import SnackbarProvider from './_parts/snackbar-provider'
import './_parts/setup-dayjs-locale'

/**
 * AppProviders component is a wrapper that provides various context providers and global styles
 * for the application. It includes:
 *
 * - `CssBaseline`: Provides a consistent baseline for CSS.
 * - `GlobalStyles`: Applies global CSS styles, including custom scrollbar styles.
 * - `Head`: Sets meta tags and the title for the application.
 * - `SnackbarProvider`: Provides a context for displaying snackbar(s) with a maximum of 7 snackbar(s).
 * - `SWRProvider`: Provides SWR context for data fetching.
 * - `ThemeProvider`: Provides a theme for the application.
 */
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={THEME}>
            <GlobalStyles
                styles={{
                    '::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },

                    '::-webkit-scrollbar-thumb': {
                        borderRadius: '8px',
                        backgroundColor: 'rgba(128,128,128,0.5)',

                        '&:hover': {
                            backgroundColor: 'rgba(128,128,128,0.7)',
                        },
                    },

                    '::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(128,128,128,0.1)',

                        '&:hover': {
                            backgroundColor: 'rgba(128,128,128,0.2)',
                        },
                    },
                }}
            />
            <CssBaseline />

            <SnackbarProvider />

            <SWRProvider>{children}</SWRProvider>
        </ThemeProvider>
    )
}
