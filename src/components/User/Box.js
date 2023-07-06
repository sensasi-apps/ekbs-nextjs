import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

export default function UserBox({ data: user, children, isLoading, ...props }) {
    if (!user && !isLoading) return null

    return (
        <Box {...props}>
            <Typography variant="h5" component="div">
                {isLoading ? <Skeleton /> : user?.name}
            </Typography>

            <Typography variant="caption" color="GrayText">
                {isLoading ? <Skeleton /> : user?.email}
            </Typography>

            {children}
        </Box>
    )
}
