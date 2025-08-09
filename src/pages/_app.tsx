import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter'
import { useEffect, type ReactElement, type ReactNode } from 'react'
import { Roboto } from 'next/font/google'
import Head from 'next/head'

import { AppProviders } from '@/providers/app-providers'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
})

/**
 * references:
 * - [AppProviders](https://github.com/mui/material-ui/blob/25984d5f9b4161f8feeeeb98a4e89903a163f5e0/docs/data/material/integrations/nextjs/nextjs.md?plain=1#L224-L229)
 * - [getLayout](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)
 */
export default function App(props: AppPropsWithLayout) {
    const { Component, pageProps } = props

    useEffect(() => {
        // eslint-disable-next-line
        console.log("You've got a 🍕 from @sensasi-delight")
    }, [])

    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? (page => page)

    return getLayout(
        <AppCacheProvider>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />

                <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <AppProviders>
                <div className={roboto.className}>
                    <Component {...pageProps} />
                </div>
            </AppProviders>
        </AppCacheProvider>,
    )
}

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
