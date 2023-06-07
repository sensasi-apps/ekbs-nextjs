"use client";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ActivationToggle from './ActivationToggle';
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm';

export default function DetailCard({ user }) {
	return (
		<Card>
			<CardContent>
				<Box display='flex' alignItems='center' mb={1}>
					<Typography variant="h5" component="div" mr={2}>
						{user.name}
					</Typography>
				</Box>

				<Box display='flex' alignItems='center'>
					<Typography mr={1}>
						{user.email}
					</Typography>

					<Typography variant='caption'>
						{user.citizenship_id}
					</Typography>
				</Box>

				<ActivationToggle user={user} />

				<SetPasswordButtonAndDialogForm user={user} />
			</CardContent>
		</Card>
	)
}