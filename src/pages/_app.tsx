import type { AppProps } from 'next/app'
import type { SnackbarKey } from 'notistack'

import { useEffect } from 'react'
import QueryString from 'qs'
import { SWRConfig } from 'swr'
import { closeSnackbar, enqueueSnackbar, SnackbarProvider } from 'notistack'

import Typography from '@mui/material/Typography'

import ThemeProvider from '@/providers/useTheme'
import { AuthProvider } from '@/providers/Auth'
import axios from '@/lib/axios'
import Head from 'next/head'

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
        <ThemeProvider>
            <AuthProvider>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                />

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
                    <Head>
                        <meta
                            name="viewport"
                            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                        />
                    </Head>
                    <Component {...pageProps} />
                </SWRConfig>

                {process.env.VERCEL_ENV === 'preview' && (
                    <Typography
                        position="fixed"
                        bottom="0"
                        variant="overline"
                        fontSize="1rem"
                        component="div"
                        align="center"
                        width="100%"
                        bgcolor="warning.dark"
                        zIndex="tooltip"
                        sx={{
                            pointerEvents: 'none',
                            opacity: 0.5,
                        }}>
                        <div>Halaman ini hanya untuk tujuan demonstrasi</div>
                    </Typography>
                )}
            </AuthProvider>
        </ThemeProvider>
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
