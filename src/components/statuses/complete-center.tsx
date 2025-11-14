import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export default function CompleteCenter({
    message,
    isShow = true,
    children,
    ...props
}: {
    children?: ReactNode
    isShow?: boolean
    message?: string
}) {
    return (
        <Box
            display={isShow ? 'block' : 'none'}
            my={4}
            textAlign="center"
            {...props}>
            <Typography>
                <CheckCircleOutlineIcon
                    color="success"
                    sx={{ fontSize: '8rem' }}
                />
            </Typography>

            <Typography color="inherit" variant="overline">
                {message || children || 'Berhasil.'}
            </Typography>
        </Box>
    )
}
