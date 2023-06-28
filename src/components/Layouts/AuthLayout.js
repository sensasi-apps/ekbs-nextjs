import dynamic from 'next/dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

const DynamicTopBarAndMenuList = dynamic(() => import('./TopBarAndMenuList'))

const AuthLayout = ({ title, children }) => {
    const drawerWidth = 240
    const router = useRouter()

    useEffect(() => {
        // redirect if not logged in
        if (
            window !== undefined &&
            (window.localStorage.getItem('isLoggedIn') === 'false' ||
                window.localStorage.getItem('isLoggedIn') === null)
        ) {
            router.replace('/login')
        }
    }, [])

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
