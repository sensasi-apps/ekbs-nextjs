import { AppProvider } from '@/providers/App'
import ThemeProvider from '@/providers/Theme'

const App = ({ Component, pageProps }) => {
    return (
        <AppProvider>
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </AppProvider>
    )
}

export default App
