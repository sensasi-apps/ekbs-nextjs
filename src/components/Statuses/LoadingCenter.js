"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingCenter({ isShow = true, ...props }) {
	return <Box
		sx={{
			display: isShow ? 'block' : 'none'
		}} my={3} textAlign='center'
		{...props}
	>
		<CircularProgress />
	</Box>;
}