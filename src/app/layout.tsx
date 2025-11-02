// vendors

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import RedirectIfBrowserIsUnsupported from '@/components/redirect-if-browser-is-unsupported'
//
import { AppProviders } from '@/providers/app-providers'
import PresenceOnlineUsers from './_parts/presence-online-users'

const roboto = Roboto({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-roboto',
    weight: ['300', '400', '500', '700'],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <RedirectIfBrowserIsUnsupported />
            <PresenceOnlineUsers />

            <body className={roboto.variable}>
                <AppRouterCacheProvider>
                    <InitColorSchemeScript attribute="class" />

                    <AppProviders>{children}</AppProviders>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}

const APP_NAME = 'EKBS'
const APP_DEFAULT_TITLE = process.env.NEXT_PUBLIC_APP_NAME ?? ''
const APP_TITLE_TEMPLATE = `%s - ${process.env.NEXT_PUBLIC_APP_NAME}`
const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_NAME

export const metadata: Metadata = {
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    applicationName: APP_NAME,
    description: APP_DESCRIPTION,
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        description: APP_DESCRIPTION,
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        type: 'website',
    },
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    twitter: {
        card: 'summary',
        description: APP_DESCRIPTION,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
    },
}
