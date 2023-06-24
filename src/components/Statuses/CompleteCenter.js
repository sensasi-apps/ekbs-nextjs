'use client'

import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

function CompleteCenter({ message, isShow = true, children, ...props }) {
    return (
        <Box
            textAlign="center"
            my={4}
            display={isShow ? 'block' : 'none'}
            {...props}>
            <Typography>
                <CheckCircleOutlineIcon
                    sx={{ fontSize: '8rem' }}
                    color="success"
                />
            </Typography>

            <Typography variant="overline" color="inherit">
                {message || children || 'Berhasil.'}
            </Typography>
        </Box>
    )
}

CompleteCenter.propTypes = {
    message: PropTypes.string,
    children: PropTypes.string,
}

export default CompleteCenter
