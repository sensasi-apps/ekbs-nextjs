'use client'

// types
import { type ReactNode } from 'react'
// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
// parts
import FooterBox from './FooterBox'
import TopBar from './_parts/TopBar'
import NavBar from './_parts/nav-bar'
import WIDTH from './_parts/nav-bar/WIDTH'
// hooks
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import { The401Protection } from './auth-layout.401-protection'

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

                <The401Protection hasMenu />

                <Box
                    component="main"
                    sx={{
                        p: {
                            xs: 3,
                            sm: 6,
                        },
                    }}>
                    {children}
                </Box>

                <FooterBox mt={10} mb={0} />
            </Box>
        </div>
    )
}
