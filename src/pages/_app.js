import { AppProvider } from '@/providers/App'
import { AuthProvider } from '@/providers/Auth'
import ThemeProvider from '@/providers/Theme'

const App = ({ Component, pageProps }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppProvider>
                    <Component {...pageProps} />
                </AppProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
