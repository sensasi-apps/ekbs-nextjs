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
import { stringify } from 'qs'
import { SWRConfig } from 'swr'
import axios from '@/lib/axios'
import Head from 'next/head'
import 'dayjs/locale/id'
// materials
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'
// utils
import { AuthProvider } from '@/providers/Auth'
import getTheme from '@/lib/getTheme'
import useRedirectIfBrowserIsUnsupported from '@/hooks/useRedirectIfBrowserIsUnsupported'

locale('id')

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
                <SWRConfig
                    value={{
                        fetcher: (
                            endpointPassed: [string, object] | string,
                        ) => {
                            // TODO: apply global swr

                            let endpoint: string
                            let params: object

                            if (endpointPassed instanceof Array) {
                                ;[endpoint, params] = endpointPassed
                            } else {
                                endpoint = endpointPassed
                                params = {}
                            }

                            return axios
                                .get(endpoint, {
                                    params: params,
                                    paramsSerializer: params =>
                                        stringify(params),
                                })
                                .then(res => res.data)
                        },
                        shouldRetryOnError: false,
                        revalidateOnFocus: false,
                        keepPreviousData: true,
                    }}>
                    {children}
                </SWRConfig>
            </AuthProvider>
        </CssVarsProvider>
    )
}
