import Box, { type BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

interface LoadingCenterProps extends BoxProps {
    isShow?: boolean
    message?: string
}

export default function LoadingCenter({
    isShow = true,
    message,
    children,
    ...props
}: LoadingCenterProps) {
    return (
        <Box
            display={isShow ? 'block' : 'none'}
            my={3}
            textAlign="center"
            {...props}>
            <CircularProgress />
            <Box mt={2}>{message ?? children}</Box>
        </Box>
    )
}
