import { FC } from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const ErrorCenter: FC<
    {
        message?: string
        isShow?: boolean
        onClose?: () => void
    } & BoxProps
> = ({ message, isShow = true, onClose, children, ...props }) => {
    return (
        <Box
            textAlign="center"
            my={4}
            display={isShow ? 'block' : 'none'}
            {...props}>
            <Typography>
                <ErrorOutlineIcon sx={{ fontSize: '8rem' }} color="error" />
            </Typography>

            <Typography variant="overline">
                {message || children || 'Terjadi kesalahan.'}
            </Typography>

            {onClose && (
                <Box mt={6}>
                    <Button variant="contained" onClick={onClose} color="error">
                        Kembali
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default ErrorCenter
