// vendors
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
//
import { AppProviders } from '@/providers/app-providers'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
})

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_NAME,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={roboto.variable}>
                <AppRouterCacheProvider>
                    <InitColorSchemeScript attribute="class" />

                    <AppProviders>{children}</AppProviders>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}
