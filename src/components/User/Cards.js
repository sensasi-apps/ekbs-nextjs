import { useRouter } from 'next/router'
import { useState } from 'react';
import useSWR from 'swr';

import { Box, Button, Card, CardContent } from '@mui/material';

import axios from '@/lib/axios';

import ActivationToggle from './ActivationToggle';
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm';
import UserBox from './Box';
import UserDetailsTabCard from './DetailsTabCard';
import UserForm from './Form';

export default function UserCards() {
	const router = useRouter();

	const uuid = router.query.uuid;

	const [isUserFormOpen, setIsUserFormOpen] = useState(false);

	const userWithDetailsFetcher = async (url) => {
		const { data } = await axios.get(url);
		return data;
	}

	const { data: workingUser, isLoading } = useSWR(uuid ? `/users/${uuid}` : null, userWithDetailsFetcher);

	return (
		<>
			<Card>
				<CardContent>
					{
						!isUserFormOpen
							? <UserBox data={workingUser} isLoading={isLoading}>
								{/* TODO: set role and permission */}
								{/* TODO: set socmed */}

								<ActivationToggle data={workingUser} isLoading={isLoading} />

								<Box mt={2} display='flex' justifyContent='space-between' alignItems='center'>
									<SetPasswordButtonAndDialogForm data={workingUser} isLoading={isLoading} />

									<Button
										disabled={isLoading}
										size="small"
										color='warning'
										onClick={() => setIsUserFormOpen(true)}
									>
										Perbaharui data akun
									</Button>
								</Box>
							</UserBox>
							: <UserForm
								data={workingUser}
								onClose={() => setIsUserFormOpen(false)}
							/>
					}
				</CardContent>
			</Card>

			<UserDetailsTabCard data={workingUser} isLoading={isLoading} />
		</>
	)
}