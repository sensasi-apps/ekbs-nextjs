import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import type { AppProps } from 'next/app'
import type { SnackbarKey } from 'notistack'

import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

import Head from 'next/head'
import dynamic from 'next/dynamic'
import QueryString from 'qs'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { useEffect } from 'react'
import { SWRConfig } from 'swr'
import { closeSnackbar, enqueueSnackbar, SnackbarProvider } from 'notistack'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

const Typography = dynamic(() => import('@mui/material/Typography'))

import { AuthProvider } from '@/providers/Auth'
import axios from '@/lib/axios'

import getTheme from '@/lib/getTheme'

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        window.addEventListener('online', onlineNotification, false)
        window.addEventListener('offline', offlineNotification, false)

        return () => {
            window.removeEventListener('online', onlineNotification, false)
            window.removeEventListener('offline', offlineNotification, false)
        }
    }, [])

    return (
        <CssVarsProvider theme={getTheme()}>
            <GlobalStyles
                styles={{
                    '::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px',
                    },

                    '::-webkit-scrollbar-thumb': {
                        borderRadius: '10px',
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
            />

            <AuthProvider>
                <SWRConfig
                    value={{
                        fetcher: (endpointPassed: any[] | string) => {
                            // TODO: apply global swr

                            let endpoint: string
                            let params: any

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
                                        QueryString.stringify(params),
                                })
                                .then(res => res.data)
                        },
                        shouldRetryOnError: false,
                        revalidateOnFocus: false,
                        revalidateIfStale: false,
                    }}>
                    <Component {...pageProps} />
                </SWRConfig>
            </AuthProvider>

            {process.env.VERCEL_ENV === 'preview' && (
                <Typography
                    position="fixed"
                    bottom="0"
                    variant="overline"
                    fontSize="1rem"
                    align="center"
                    width="100%"
                    bgcolor="warning.dark"
                    color="warning.contrastText"
                    fontWeight="bold"
                    zIndex="tooltip"
                    lineHeight="unset"
                    p={2}
                    style={{
                        pointerEvents: 'none',
                        opacity: 0.5,
                    }}>
                    <div>Halaman ini hanya untuk tujuan demonstrasi</div>
                </Typography>
            )}
        </CssVarsProvider>
    )
}

let persistedSnacbarKey: SnackbarKey

const onlineNotification = () => {
    closeSnackbar(persistedSnacbarKey)

    enqueueSnackbar('Anda kembali online', {
        variant: 'success',
        autoHideDuration: 10000,
    })
}

const offlineNotification = () => {
    persistedSnacbarKey = enqueueSnackbar(
        'Jaringan terputus, mohon periksa periksa jaringan anda',
        {
            variant: 'warning',
            persist: true,
        },
    )
}
