"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function LoadingCenter({ title, setIsError }) {
	return <Box textAlign='center' my={4}>
		<Typography>
			<ErrorOutlineIcon sx={{ fontSize: '8rem' }} color="error" />
		</Typography>

		<Typography variant="overline">
			{title}
		</Typography>

		<Box mt={6}>
			<Button
				variant="contained"
				onClick={() => setIsError(false)}
				color="error"
			>Kembali</Button>
		</Box>
	</Box>;
}