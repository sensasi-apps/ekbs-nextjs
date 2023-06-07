"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingCenter(props) {
	return <Box {...props} my={4} textAlign='center'>
		<CircularProgress />
	</Box>;
}