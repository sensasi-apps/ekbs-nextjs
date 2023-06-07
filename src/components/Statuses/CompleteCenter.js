"use client";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function CompleteCenter({ message, ...props }) {
	return <Box {...props} textAlign='center' my={4}>
		<Typography>
			<CheckCircleOutlineIcon sx={{ fontSize: '8rem' }} color="success" />
		</Typography>

		<Typography variant="overline" color='inherit'>
			{message}
		</Typography>
	</Box>;
}

CompleteCenter.propTypes = {
	message: PropTypes.string.isRequired
};

export default CompleteCenter;