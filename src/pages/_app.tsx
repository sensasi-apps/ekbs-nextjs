import type { AppProps } from 'next/app'
import { AppProviders } from '@/providers/app-providers'
import { useEffect } from 'react'

export default function App(props: AppProps) {
    const { Component, pageProps } = props

    useEffect(() => {
        // eslint-disable-next-line
        console.log("You've got a 🍕 from @sensasi-delight")
    }, [])

    return (
        <AppProviders {...props}>
            <Component {...pageProps} />
        </AppProviders>
    )
}
