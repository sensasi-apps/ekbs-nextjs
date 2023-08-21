import { AuthProvider } from '@/providers/Auth'
import ThemeProvider from '@/providers/Theme'

const App = ({ Component, pageProps }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
