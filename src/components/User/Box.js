import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

export default function UserBox({ data: user, children, ...props }) {
    return (
        <Box {...props}>
            <Typography variant="h5" component="div">
                {user?.name || <Skeleton />}

                {user.uuid && (
                    <Typography
                        variant="h6"
                        ml={1}
                        color="GrayText"
                        component="span">
                        #{user?.id}
                    </Typography>
                )}
            </Typography>

            <Typography variant="caption" color="GrayText">
                {user.uuid ? user?.email : <Skeleton />}
            </Typography>

            {children}
        </Box>
    )
}
