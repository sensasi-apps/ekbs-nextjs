// vendors
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
//
import { AppProviders } from '@/providers/app-providers'
import RedirectIfBrowserIsUnsupported from '@/components/redirect-if-browser-is-unsupported'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <RedirectIfBrowserIsUnsupported />

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
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
}
