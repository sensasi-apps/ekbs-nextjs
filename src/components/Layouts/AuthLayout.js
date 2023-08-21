import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useAuth from '@/providers/Auth'
import { DRAWER_WIDTH } from './MenuList'

const DynamicTopBarAndMenuList = dynamic(() => import('./TopBarAndMenuList'))

const AuthLayout = ({ title, children }) => {
    const router = useRouter()
    const { error } = useAuth()

    useEffect(() => {
        if (error?.response.status === 401) {
            const redirectTo = location.pathname

            if (redirectTo === '/logout') {
                router.replace(`/login`)
            } else {
                router.replace(`/login?redirectTo=${redirectTo}`)
            }
        }
    }, [error])

    return (
        <Box sx={{ display: 'flex' }}>
            <DynamicTopBarAndMenuList title={title} />

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
        </Box>
    )
}

export default AuthLayout
