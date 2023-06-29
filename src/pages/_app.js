import { AppProvider } from '@/providers/App'
import ThemeProvider from '@/providers/Theme'

const App = ({ Component, pageProps }) => {
    return (
        <ThemeProvider>
            <AppProvider>
                <Component {...pageProps} />
            </AppProvider>
        </ThemeProvider>
    )
}

export default App
