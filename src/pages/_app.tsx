import type { AppProps } from 'next/app'
import type { SnackbarKey } from 'notistack'

import { useEffect } from 'react'
import { closeSnackbar, enqueueSnackbar, SnackbarProvider } from 'notistack'

import Typography from '@mui/material/Typography'

import ThemeProvider from '@/providers/Theme'
import { AuthProvider } from '@/providers/Auth'

let persistedSnacbarKey: SnackbarKey

const onlineNotification = () => {
    closeSnackbar(persistedSnacbarKey)

    enqueueSnackbar('Anda kembali online', {
        variant: 'success',
    })
}

const offlineNotification = () => {
    persistedSnacbarKey = enqueueSnackbar(
        'Jaringan terputus, mohon periksa jaringan anda',
        {
            variant: 'warning',
            persist: true,
        },
    )
}

const App = ({ Component, pageProps }: AppProps) => {
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
                <Component {...pageProps} />

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

export default App
