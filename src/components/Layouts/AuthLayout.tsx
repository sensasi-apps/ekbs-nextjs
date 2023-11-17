// types
import type { ReactNode } from 'react'
// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
// providers
import useAuth from '@/providers/Auth'
// components
import { DRAWER_WIDTH } from './MenuList'
import TopBarAndMenuList from './TopBarAndMenuList'
import LoginFormDialog from './Auth/LoginFormDialog'
import FooterBox from './FooterBox'

export default function AuthLayout({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    const router = useRouter()
    const { onError401, user } = useAuth()

    useEffect(() => {
        window.addEventListener('401Error', onError401, false)
        return () => {
            window.removeEventListener('401Error', onError401, false)
        }
    }, [])

    useEffect(() => {
        if (user === null) {
            const redirectTo = location.pathname

            if (redirectTo === '/logout') {
                router.replace(`/login`)
            } else {
                router.replace(`/login?redirectTo=${redirectTo}`)
            }
        }
    }, [user])

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

            <LoginFormDialog />
        </div>
    )
}
