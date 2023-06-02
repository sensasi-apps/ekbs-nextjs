"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function LoadingCenter({ title }) {
	return <Box textAlign='center' my={4}>
		<Typography>
			<CheckCircleOutlineIcon sx={{ fontSize: '8rem' }} color="success" />
		</Typography>

		<Typography variant="overline" color='inherit'>
			{title}
		</Typography>
	</Box>;
}