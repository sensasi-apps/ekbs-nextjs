import { type FC } from 'react'
import Box, { type BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

interface LoadingCenterProps extends BoxProps {
    isShow?: boolean
    message?: string
}

const LoadingCenter: FC<LoadingCenterProps> = ({
    isShow = true,
    message,
    children,
    ...props
}) => {
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

export default LoadingCenter
