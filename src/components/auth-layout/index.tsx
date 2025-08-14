// types
import { type ReactNode } from 'react'
// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
// components
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'
// parts
import FooterBox from '../footer-box'
import TopBar from './_parts/top-bar'
import NavBar from './_parts/nav-bar'
import WIDTH from './_parts/nav-bar/WIDTH'
import ContentGuard from '@/app/(auth)/_parts/content-guard'

export default function AuthLayout({
    title,
    children,
    subtitle,
}: {
    title: string
    children: ReactNode
    subtitle?: string
}) {
    return (
        <div
            style={{
                display: 'flex',
            }}>
            <RedirectIfUnauth />

            <The401Protection />

            <Head>
                {title !== '' && (
                    <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
                )}

                {subtitle && <meta name="description" content={subtitle} />}

                <meta
                    name="robots"
                    content="noindex, nofollow, noarchive, nosnippet, noimageindex"
                />
                <meta name="googlebot" content="noindex, nofollow" />
            </Head>

            <NavBar />

            <Box
                flexGrow="1"
                width={{
                    xs: '100%',
                    sm: `calc(100% - ${WIDTH}px)`,
                }}>
                <TopBar title={title} subtitle={subtitle} />

                <Box
                    component="main"
                    sx={{
                        p: {
                            xs: 3,
                            sm: 6,
                        },
                    }}>
                    <ContentGuard>{children}</ContentGuard>
                </Box>

                <FooterBox mt={10} mb={6} />
            </Box>
        </div>
    )
}
