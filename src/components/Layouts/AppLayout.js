import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

const DynamicMenuList = dynamic(() => import('./MenuList'))
const DynamicTopBar = dynamic(() => import('./TopBar'))

const drawerWidth = 240

const AppLayout = ({ pageTitle, children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <DynamicTopBar pageTitle={pageTitle} />
            <DynamicMenuList />

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

export default AppLayout
