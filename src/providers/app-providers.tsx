// assets
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
// types
import type { ReactNode } from 'react'
// vendors
import { closeSnackbar, SnackbarProvider } from 'notistack'
import { locale } from 'dayjs'
import Head from 'next/head'
import 'dayjs/locale/id'
// materials
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'
// providers
import { AuthProvider } from '@/providers/Auth'
import { SWRProvider } from './swr'
// utils
import getTheme from '@/lib/getTheme'
import useRedirectIfBrowserIsUnsupported from '@/hooks/useRedirectIfBrowserIsUnsupported'

locale('id')

/**
 * AppProviders component is a wrapper that provides various context providers and global styles
 * for the application. It includes:
 *
 * - `useRedirectIfBrowserIsUnsupported`: A hook to redirect if the browser is unsupported.
 * - `CssVarsProvider`: Provides CSS variables for theming.
 * - `GlobalStyles`: Applies global CSS styles, including custom scrollbar styles.
 * - `CssBaseline`: Provides a consistent baseline for CSS.
 * - `Head`: Sets meta tags and the title for the application.
 * - `SnackbarProvider`: Provides a context for displaying snackbars with a maximum of 7 snackbars.
 * - `AuthProvider`: Provides authentication context.
 * - `SWRProvider`: Provides SWR context for data fetching.
 */
export function AppProviders({ children }: { children: ReactNode }) {
    useRedirectIfBrowserIsUnsupported()

    return (
        <CssVarsProvider theme={getTheme()}>
            <GlobalStyles
                styles={{
                    '::-webkit-scrollbar': {
                        width: '5px',
                        height: '5px',
                    },

                    '::-webkit-scrollbar-thumb': {
                        borderRadius: '5px',
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

            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
                <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                action={key => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                )}
                maxSnack={7}
            />

            <AuthProvider>
                <SWRProvider>{children}</SWRProvider>
            </AuthProvider>
        </CssVarsProvider>
    )
}
