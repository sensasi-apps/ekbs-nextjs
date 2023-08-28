import dynamic from 'next/dynamic'
import { AuthProvider } from '@/providers/Auth'
import ThemeProvider from '@/providers/Theme'

const Typography = dynamic(() => import('@mui/material/Typography'))

const App = ({ Component, pageProps }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
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
