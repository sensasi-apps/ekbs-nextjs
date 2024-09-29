import type { AppProps } from 'next/app'
import { Typography } from '@mui/material'
import { AppProviders } from '@/providers/app-providers'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AppProviders>
            <Component {...pageProps} />

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
        </AppProviders>
    )
}
