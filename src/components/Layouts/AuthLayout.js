import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useAuth from '@/providers/Auth'

const DynamicTopBarAndMenuList = dynamic(() => import('./TopBarAndMenuList'))

const drawerWidth = 240

const AuthLayout = ({ title, children }) => {
    const router = useRouter()
    const { error } = useAuth()

    useEffect(() => {
        if (error?.response.status === 401) {
            const redirectTo = location.pathname
            router.replace(`/login?redirectTo=${redirectTo}`)
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
                        sm: `calc(100% - ${drawerWidth}px)`,
                    },
                }}>
                <Toolbar />

                {children}
            </Box>
        </Box>
    )
}

export default AuthLayout
