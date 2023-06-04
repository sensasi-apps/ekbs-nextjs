import { useState } from 'react';

import Head from 'next/head'

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import AppLayout from '@/components/Layouts/AppLayout'
import UserForm from '@/components/User/Form';
import UserDetail from '@/components/User/Detail';
import UserSelect from '@/components/User/Select'

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SpeedDial from '@/components/SpeedDial';


const Users = () => {
	const [user, setUser] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<AppLayout
			pageTitle={'Pengguna'}>
			<Head>
				<title>{`Pengguna — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
			</Head>

			<Container maxWidth="sm">
				<UserSelect user={user} setUser={setUser} />

				{user &&
					<Box mt={3}>
						<UserDetail user={user} />
					</Box>
				}
			</Container>

			<SpeedDial
				ariaLabel="Tombol aksi"
				color={user ? 'warning' : 'success'}
				icon={user ? <EditIcon /> : <AddIcon />}
				onClick={() => setIsFormOpen(true)}
				actions={user ? [
					{
						tooltipTitle: 'Tambah pengguna lain',
						icon: <AddIcon />,
						onClick: () => {
							setUser(null)
							setIsFormOpen(true)
						}
					},
				] : []}
			/>

			<Dialog fullWidth
				maxWidth="sm" open={isFormOpen} onKeyDown={e =>
					e.key === 'Escape' && setIsFormOpen(false)
				}>
				<DialogContent>
					<Box display='flex' mb={2} alignItems='center'>
						<Typography variant='h6' component='h2' flexGrow={1}>
							{user ? 'Ubah' : 'Tambah'} Pengguna
						</Typography>

						<IconButton disabled={isLoading} onClick={() => setIsFormOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>

					<UserForm {...{
						user,
						setUser,
						isLoading,
						setIsLoading
					}} />
				</DialogContent>
			</Dialog>
		</AppLayout >
	)
}

export default Users
