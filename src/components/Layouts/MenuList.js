import { useRouter } from 'next/router';
import { AppContext } from '../AppContext';
import { useContext, useEffect } from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import BalanceIcon from '@mui/icons-material/Balance';
import ForestIcon from '@mui/icons-material/Forest';

const drawerWidth = 240;

function MenuList(props) {
	const { window } = props;

	const router = useRouter();
	const { setIsLoading, isDrawerOpen, toggleDrawer } = useContext(AppContext);

	const handleLinkClick = () => {
		setIsLoading(true);
	};

	useEffect(() => {
		const handleRouteChangeStart = () => {
			setIsLoading(true);
		};

		const handleRouteChangeComplete = () => {
			setIsLoading(false);
		};

		router.events.on('routeChangeStart', handleRouteChangeStart);
		router.events.on('routeChangeComplete', handleRouteChangeComplete);

		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart);
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
		};
	}, []);

	const drawer = (
		<>
			<Toolbar />
			<Divider />

			<ListItem disablePadding sx={{ mt: 2 }}>
				<ListItemButton href='/dashboard' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/dashboard'}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dasbor" />
				</ListItemButton>
			</ListItem>
			<Typography ml={2} mt={2} variant='overline' color='grey' fontWeight='bold'>Unit</Typography>

			<ListItem disablePadding>
				<ListItemButton href='/TBS' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/TBS'}>
					<ListItemIcon>
						<BalanceIcon />
					</ListItemIcon>
					<ListItemText primary="TBS" />
				</ListItemButton>
			</ListItem>

			<ListItem disablePadding>
				<ListItemButton href='/saprodi' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/saprodi'}>
					<ListItemIcon>
						<ForestIcon />
					</ListItemIcon>
					<ListItemText primary="SAPRODI" />
				</ListItemButton>
			</ListItem>

			<ListItem disablePadding>
				<ListItemButton href='/alat-berat' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/alat-berat'}>
					<ListItemIcon>
						<FireTruckIcon />
					</ListItemIcon>
					<ListItemText primary="Alat Berat" />
				</ListItemButton>
			</ListItem>

			<ListItem disablePadding>
				<ListItemButton href='/spp' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/spp'}>
					<ListItemIcon>
						<CurrencyExchangeIcon />
					</ListItemIcon>
					<ListItemText primary="SPP" />
				</ListItemButton>
			</ListItem>

			<Divider sx={{ mt: 2 }} />
			<Typography ml={2} mt={2} variant='overline' color='grey' fontWeight='bold'>Sistem</Typography>

			<List>
				<ListItem disablePadding>
					<ListItemButton href='/users' shallow={true} passHref onClick={handleLinkClick} selected={router.pathname === '/users'}>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Pengguna" />
					</ListItemButton>
				</ListItem>
			</List>
		</>
	)

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
			<Drawer
				container={container}
				variant="temporary"
				open={isDrawerOpen}
				onClose={toggleDrawer}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>

			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
}

MenuList.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default MenuList;
