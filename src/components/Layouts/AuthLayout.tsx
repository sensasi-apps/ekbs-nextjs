import { FC, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useAuth from '@/providers/Auth'

import { DRAWER_WIDTH } from './MenuList'
import TopBarAndMenuList from './TopBarAndMenuList'
import LoginFormDialog from './Auth/LoginFormDialog'

const AuthLayout: FC<{
    title: string
    children?: ReactNode
}> = ({ title, children }) => {
    const router = useRouter()
    const { onError401, user } = useAuth()

    useEffect(() => {
        // TODO: pending handler
        // window.addEventListener('online', onlineNotification, false)

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
        <Box sx={{ display: 'flex' }}>
            <TopBarAndMenuList title={title} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mb: 10,
                    width: {
                        xs: '100%',
                        sm: `calc(100% - ${DRAWER_WIDTH}px)`,
                    },
                }}>
                <Toolbar />

                {children}
            </Box>

            <LoginFormDialog />
        </Box>
    )
}

export default AuthLayout
