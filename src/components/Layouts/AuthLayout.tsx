// types
import type { ReactNode } from 'react'
// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
// components
import { DRAWER_WIDTH } from './components/menu-list'
import TopBarAndMenuList from './TopBarAndMenuList'
import FooterBox from './FooterBox'
import { useRedirectIfUnauth } from '@/hooks/use-redirect-if-unauth'

export default function AuthLayout({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    useRedirectIfUnauth()

    return (
        <div
            style={{
                display: 'flex',
            }}>
            <Head>
                {title && (
                    <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
                )}
            </Head>

            <TopBarAndMenuList title={title} />

            <Box
                flexGrow="1"
                p={3}
                component="main"
                width={{
                    xs: '100%',
                    sm: `calc(100% - ${DRAWER_WIDTH}px)`,
                }}>
                <Toolbar />
                {children}

                <FooterBox mt={10} mb={0} />
            </Box>
        </div>
    )
}
