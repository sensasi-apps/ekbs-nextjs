"use client";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorCenter({ message, isShow = true, onClose, children, ...props }) {
	return <Box textAlign='center' my={4} display={isShow ? 'block' : 'none'} {...props}>
		<Typography>
			<ErrorOutlineIcon sx={{ fontSize: '8rem' }} color="error" />
		</Typography>

		<Typography variant="overline">
			{message || children || 'Terjadi kesalahan.'}
		</Typography>

		{
			onClose && <Box mt={6}>
				<Button
					variant="contained"
					onClick={onClose}
					color="error"
				>Kembali</Button>
			</Box>
		}

	</Box>;
}

ErrorCenter.propTypes = {
	message: PropTypes.string,
	children: PropTypes.string,
	onClose: PropTypes.func
};


export default ErrorCenter;