import { useState } from 'react';

import Head from 'next/head'

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

import AppLayout from '@/components/Layouts/AppLayout';
import Summary from '@/components/User/Summary';
import UserCard from '@/components/User/Card';
import UserForm from '@/components/User/Form';
import UserSelect from '@/components/User/Select'



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

			<Grid
				container
				spacing={3}
				sx={{
					flexDirection: {
						xs: 'column-reverse',
						sm: 'column-reverse',
						md: 'row'
					}
				}}
			>
				<Grid item sm={12} md={8}>
					<Box mb={3}>
						<UserSelect user={user} setUser={setUser} />

						{user?.id &&
							<Box mt={3}>
								<UserCard user={user} />
							</Box>
						}
					</Box>
				</Grid>

				<Grid item sm={12} md={4} width='100%'>
					<Summary />
				</Grid>
			</Grid>

			<Fab
				onClick={() => setIsFormOpen(true)}
				color="success" aria-label="tambah pengguna"
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
			>
				<PersonAddIcon />
			</Fab>

			<Dialog fullWidth
				maxWidth="sm" open={isFormOpen} onKeyDown={e =>
					e.key === 'Escape' && setIsFormOpen(false)
				}>
				<DialogContent>
					<Box display='flex' mb={2} alignItems='center'>
						<Typography variant='h6' component='h2' flexGrow={1}>
							Daftarkan akun baru
						</Typography>

						{/* <IconButton disabled={isLoading} onClick={() => setIsFormOpen(false)}>
							<CloseIcon />
						</IconButton> */}
					</Box>

					<UserForm
						onChange={user => setUser(user)}
						onClose={() => setIsFormOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</AppLayout >
	)
}

export default Users
