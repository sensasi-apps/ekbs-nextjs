import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '../AppContext';
import { useContext } from 'react';
import { useAuth } from '@/hooks/auth';

import debounce from '@/lib/debounce';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
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
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

function isAuthorized(user, menu) {
	if (user?.role_names?.includes('superman') || !menu.forRoles || !menu.forPermissions) {
		return true;
	}

	let isAuthorized = false;

	user?.role_names?.forEach(role => {
		if (menu.forRoles.includes(role)) {
			isAuthorized = true;
			return;
		}
	});

	if (isAuthorized) {
		return isAuthorized;
	}

	user?.permission_names?.forEach(permission => {
		if (menu.forPermissions.includes(permission)) {
			isAuthorized = true;
			return;
		}
	});

	return isAuthorized;
}

function CustomListItem({ data, user, ...props }) {
	const router = useRouter();

	if (!isAuthorized(user, data)) {
		return;
	}

	if (data.component) {
		return data.component;
	}

	return <ListItem disablePadding>
		<ListItemButton
			shallow={true}
			passHref
			href={data.href}
			selected={router.pathname === data.pathname}
			{...props}
		>
			<ListItemIcon>
				{data.icon}
			</ListItemIcon>
			<ListItemText primary={data.label} />
		</ListItemButton>
	</ListItem>
}

const drawerWidth = 240;

const SubTitle = ({ children }) => <Typography ml={2} mt={2} variant='overline' color='grey' fontWeight='bold'>{children}</Typography>

const MENUS_DATA = [
	{
		href: '/dashboard',
		label: 'Dasbor',
		pathname: '/dashboard',
		icon: <DashboardIcon />
	}, {
		component: <SubTitle children='Unit' />
	}, {
		href: '/TBS',
		label: 'TBS',
		pathname: '/TBS',
		icon: <BalanceIcon />
	}, {
		href: '/saprodi',
		label: 'SAPRODI',
		pathname: '/saprodi',
		icon: <ForestIcon />
	}, {
		href: '/alat-berat',
		label: 'Alat Berat',
		pathname: '/alat-berat',
		icon: <FireTruckIcon />
	}, {
		href: '/spp',
		label: 'SPP',
		pathname: '/spp',
		icon: <CurrencyExchangeIcon />
	}, {
		component: <Divider sx={{ mt: 2 }} />
	}, {
		component: <SubTitle children='Keuangan' />
	}, {
		href: '/cashes',
		label: 'Kas',
		pathname: '/cashes/[[...uuid]]',
		icon: <AutoStoriesIcon />
	}, {
		component: <Divider sx={{ mt: 2 }} />,
		forRoles: ['users admin'],
		forPermissions: [
			'users create',
			'users update',
			'users read',
			'users search'
		]
	}, {
		component: <SubTitle children='Sistem' />,
		forRoles: ['users admin'],
		forPermissions: [
			'users create',
			'users update',
			'users read',
			'users search'
		]
	}, {
		href: '/users',
		label: 'Pengguna',
		pathname: '/users/[[...uuid]]',
		icon: <GroupIcon />,
		forRoles: ['users admin'],
		forPermissions: [
			'users create',
			'users update',
			'users read',
			'users search'
		]
	}
]

function MenuList() {

	const { isDrawerOpen, toggleDrawer } = useContext(AppContext);
	const [drawerProps, setDrawerProps] = useState({});

	const { user } = useAuth({ middleware: 'auth' });

	function GET_DRAWER_PROPS() {
		if (window.innerWidth < 600) {
			return {
				variant: "temporary",
				onClose: toggleDrawer
			}
		}

		return {
			variant: "permanent",
			onClose: null
		}
	}

	useEffect(() => {
		setDrawerProps(GET_DRAWER_PROPS());

		window.addEventListener("resize", debounce(() => {
			setDrawerProps(GET_DRAWER_PROPS());
		}, 300));
	}, []);

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			<Drawer
				{...drawerProps}
				open={isDrawerOpen}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth
					}
				}}
			>
				<Toolbar />

				{
					MENUS_DATA.map((data, index) => <CustomListItem
						key={index}
						data={data}
						user={user}
						onClick={debounce(toggleDrawer, 300)}
					/>)
				}
			</Drawer>
		</Box>
	);
}

export default MenuList;
