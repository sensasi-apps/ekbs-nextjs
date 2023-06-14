"use client";

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

export default function UserBox({ data: user, onClose, children, isLoading, ...props }) {
	if (!user && !isLoading) return null;

	return (
		<Box {...props}>
			<Typography variant="h5" component="div">
				{
					user?.name ? user.name : <Skeleton />
				}
			</Typography>

			<Typography variant="caption" color='GrayText'>
				{
					user?.email ? user.email : <Skeleton />
				}
			</Typography>

			{children}

		</Box>
	)
}