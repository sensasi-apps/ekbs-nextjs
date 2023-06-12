"use client";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function UserBox({ data: user, onClose, children, ...props }) {
	if (!user) return null;

	return (
		<Box {...props}>
			<Box display='flex' alignItems='center' mb={1}>
				<Typography variant="h5" component="div" mr={1}>
					{user.name}
				</Typography>
			</Box>

			<Typography mr={1}>
				{user.email}
			</Typography>

			{children}

		</Box>
	)
}