// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { FC, ReactNode } from 'react'

const CompleteCenter: FC<{
    children?: ReactNode
    isShow?: boolean
    message?: string
}> = ({ message, isShow = true, children, ...props }) => (
    <Box
        display={isShow ? 'block' : 'none'}
        my={4}
        textAlign="center"
        {...props}>
        <Typography>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: '8rem' }} />
        </Typography>

        <Typography color="inherit" variant="overline">
            {message || children || 'Berhasil.'}
        </Typography>
    </Box>
)

export default CompleteCenter
