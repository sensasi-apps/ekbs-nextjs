// types
import { useState, type ReactNode } from 'react'
// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
// components
import MenuList, { DRAWER_WIDTH } from './components/menu-list'
import TopBar from './components/TopBar'
import FooterBox from './FooterBox'
// hooks
import { useRedirectIfUnauth } from '@/hooks/use-redirect-if-unauth'
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
    useRedirectIfUnauth()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

    return (
        <div
            style={{
                display: 'flex',
            }}>
            <Head>
                {title !== '' && (
                    <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
                )}

                {subtitle && <meta name="description" content={subtitle} />}
            </Head>

            <MenuList isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Box
                flexGrow="1"
                width={{
                    xs: '100%',
                    sm: `calc(100% - ${DRAWER_WIDTH}px)`,
                }}>
                <TopBar
                    title={title}
                    toggleDrawer={toggleDrawer}
                    subtitle={subtitle}
                />

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
