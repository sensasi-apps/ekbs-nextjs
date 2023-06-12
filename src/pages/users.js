import { useEffect, useState } from 'react';

import useSWR from 'swr';

import Head from 'next/head'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

import AppLayout from '@/components/Layouts/AppLayout';
import Summary from '@/components/User/Summary';
import LoadingCenter from '@/components/Statuses/LoadingCenter';
import UserBox from '@/components/User/Box';
import UserForm from '@/components/User/Form';
import UserSelect from '@/components/User/Select'

import axios from '@/lib/axios';

import UserDetailsTabCard from '@/components/User/DetailsTabCard';
import ActivationToggle from '@/components/User/ActivationToggle';
import SetPasswordButtonAndDialogForm from '@/components/User/SetPasswordButtonAndDialogForm';


const Users = () => {
	const [workingUser, setWorkingUser] = useState(null);
	const [uuid, setUuid] = useState(null);

	const [isUserFormOpen, setIsUserFormOpen] = useState(false);

	const userWithDetailsFetcher = async (url) => {
		const { data } = await axios.get(url);
		return data;
	}

	const { data, isLoading } = useSWR(uuid ? `/users/${uuid}` : null, userWithDetailsFetcher);

	useEffect(() => {
		if (data) {
			setWorkingUser(data);
		}
	}, [data]);

	const userSelectOnChange = async (e, value) => {
		if (!value) return;

		setIsUserFormOpen(false);
		setUuid(value.uuid);
	};

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
					<Box display='flex' flexDirection='column' gap={3}>
						<UserSelect value={workingUser} onChange={userSelectOnChange} />

						<LoadingCenter isShow={isLoading} />

						{/* User Card */}
						<Card sx={{
							display: isLoading || !workingUser || isUserFormOpen ? 'none' : 'block'
						}}>
							<CardContent>
								<UserBox data={workingUser}>
									{/* TODO: set role and permission */}
									{/* TODO: set socmed */}

									<ActivationToggle user={workingUser} />

									<Box mt={2} display='flex' justifyContent='space-between' alignItems='center'>
										<SetPasswordButtonAndDialogForm user={workingUser} />
										<Button
											size="small"
											color='warning'
											onClick={() => setIsUserFormOpen(true)}
										>Perbaharui data akun</Button>
									</Box>
								</UserBox>
							</CardContent>
						</Card>

						{/* User Form Card */}
						<Card sx={{
							display: !isUserFormOpen ? 'none' : 'block'
						}}>
							<CardContent>
								<UserForm
									data={workingUser}
									onSubmitted={user => setWorkingUser(user)}
									onClose={() => setIsUserFormOpen(false)}
									style={{
										display: isUserFormOpen ? 'block' : 'none'
									}}
								/>
							</CardContent>
						</Card>

						<UserDetailsTabCard data={workingUser} sx={{
							display: isLoading ? 'none' : 'block',
							minWidth: 320,
						}} />
					</Box>
				</Grid>

				<Grid item sm={12} md={4} width='100%'>
					<Summary />
				</Grid>
			</Grid>

			<Fab
				onClick={() => {
					setWorkingUser(null);
					setIsUserFormOpen(true);
				}}
				color="success" aria-label="tambah pengguna"
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
			>
				<PersonAddIcon />
			</Fab>
		</AppLayout >
	)
}

export default Users
