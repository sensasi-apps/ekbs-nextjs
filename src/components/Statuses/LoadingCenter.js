"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingCenter() {
	return <Box my={4} textAlign='center'>
		<CircularProgress />
	</Box>;
}