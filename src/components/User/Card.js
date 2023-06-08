"use client";

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

import ActivationToggle from './ActivationToggle';
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm';
import UserForm from './Form';

export default function UserCard({ user, setUser }) {
	const [isFormOpen, setIsFormOpen] = useState(false);

	return (
		<Card>
			<CardContent>
				{
					!isFormOpen && <Box>
						<Box display='flex' alignItems='center' mb={1}>
							<Typography variant="h5" component="div" mr={1}>
								{user.name}
							</Typography>
							<IconButton size='small' onClick={() => setIsFormOpen(true)}>
								<EditIcon />
							</IconButton>
						</Box>

						<Typography mr={1}>
							{user.email}
						</Typography>
						<ActivationToggle user={user} />
						<SetPasswordButtonAndDialogForm user={user} />
					</Box>
				}


				{
					isFormOpen && <UserForm
						user={user}
						onChange={(newUser) => setUser(newUser)}
						onClose={() => setIsFormOpen(false)}
					/>
				}

			</CardContent>
		</Card>
	)
}