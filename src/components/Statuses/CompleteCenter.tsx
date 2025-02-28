import type { FC, ReactNode } from 'react'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const CompleteCenter: FC<{
    children?: ReactNode
    isShow?: boolean
    message?: string
}> = ({ message, isShow = true, children, ...props }) => (
    <Box
        textAlign="center"
        my={4}
        display={isShow ? 'block' : 'none'}
        {...props}>
        <Typography>
            <CheckCircleOutlineIcon sx={{ fontSize: '8rem' }} color="success" />
        </Typography>

        <Typography variant="overline" color="inherit">
            {message || children || 'Berhasil.'}
        </Typography>
    </Box>
)

export default CompleteCenter
