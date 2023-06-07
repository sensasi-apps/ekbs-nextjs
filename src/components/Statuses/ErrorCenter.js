"use client";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorCenter({ message, onClose, ...props }) {
	return <Box {...props} textAlign='center' my={4}>
		<Typography>
			<ErrorOutlineIcon sx={{ fontSize: '8rem' }} color="error" />
		</Typography>

		<Typography variant="overline">
			{message}
		</Typography>

		<Box mt={6}>
			<Button
				variant="contained"
				onClick={onClose}
				color="error"
			>Kembali</Button>
		</Box>
	</Box>;
}

ErrorCenter.propTypes = {
	message: PropTypes.string,
	onClose: PropTypes.func.isRequired
};


export default ErrorCenter;