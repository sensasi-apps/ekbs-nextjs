"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingCenter({ isShow = true, message, children, ...props }) {
	return <Box display={isShow ? 'block' : 'none'} my={3} textAlign='center'
		{...props}
	>
		<CircularProgress />
		<Box mt={2}>
			{message || children}
		</Box>
	</Box>;
}