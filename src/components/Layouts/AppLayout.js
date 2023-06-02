import { useContext } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import MenuList from './MenuList'
import TopBar from './TopBar'

import { AppContext } from '../AppContext';
import LoadingCenter from '../Statuses/LoadingCenter';



const drawerWidth = 240;

const AppLayout = ({ pageTitle, children }) => {
    const { isLoading } = useContext(AppContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <TopBar pageTitle={pageTitle} />
            <MenuList />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />

                {
                    isLoading && <LoadingCenter />
                }

                {
                    !isLoading && children
                }
            </Box>
        </Box>
    )
}

export default AppLayout
