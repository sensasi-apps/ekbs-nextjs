// types
import type { ReactNode } from 'react'
// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
// providers
import useAuth from '@/providers/Auth'
// components
import { DRAWER_WIDTH } from './MenuList'
import TopBarAndMenuList from './TopBarAndMenuList'
import FooterBox from './FooterBox'

export default function AuthLayout({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    const { replace } = useRouter()
    const { onError401, user } = useAuth()

    useEffect(() => {
        window.addEventListener('401Error', onError401, false)
        return () => {
            window.removeEventListener('401Error', onError401, false)
        }
    }, [onError401])

    useEffect(() => {
        if (user === null) {
            const redirectTo = location.pathname

            if (redirectTo === '/logout') {
                replace(`/login`)
            } else {
                replace(`/login?redirectTo=${redirectTo}`)
            }
        }
    }, [user, replace])

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
