import type { AppProps } from 'next/app'
import { AppProviders } from '@/providers/app-providers'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // eslint-disable-next-line
        console.log("You've got a 🍕 from @sensasi-delight")
    }, [])

    return (
        <AppProviders>
            <Component {...pageProps} />
        </AppProviders>
    )
}
