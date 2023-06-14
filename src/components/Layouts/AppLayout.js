import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import MenuList from './MenuList'
import TopBar from './TopBar'

const drawerWidth = 240;

const AppLayout = ({ pageTitle, children }) => {

    return (
        <Box sx={{ display: 'flex' }}>
            <TopBar pageTitle={pageTitle} />
            <MenuList />

            <Box
                component="main"
                sx={{
                    flexGrow: 1, p: 3,
                    mb: 10,
                    width: {
                        xs: '100%',
                        sm: `calc(100% - ${drawerWidth}px)`,
                    }
                }}
            >
                <Toolbar />

                {children}

            </Box>
        </Box>
    )
}

export default AppLayout
