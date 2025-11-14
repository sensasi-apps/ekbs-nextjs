// types

// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
// components
import ErrorCenter from '@/components/statuses/error-center'
import LoadingCenter from '@/components/statuses/loading-center'
// parts

export default function GuestWithFormSubLayout({
    children,
    title,
    icon,
    isLoading = false,
    isError = false,
    message,
}: {
    children: ReactNode
    icon: ReactNode
    isLoading?: boolean
    isError?: boolean
    message?: string
    title: string
}) {
    return (
        <>
            <Box alignItems="center" display="flex" gap={3}>
                <Avatar
                    sx={{
                        bgcolor: () => {
                            if (isLoading) return 'primary.main'
                            if (isError) return 'error.main'
                        },
                    }}>
                    {icon}
                </Avatar>

                <Box>
                    <Typography component="div" variant="body2">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </Typography>

                    <Typography
                        component="div"
                        lineHeight="normal"
                        variant="h5">
                        {title}
                    </Typography>
                </Box>
            </Box>

            <LoadingCenter isShow={isLoading} message={message} />

            <ErrorCenter isShow={isError} message={message} />

            <Box display={isLoading ? 'none' : 'block'} mt={2}>
                {children}
            </Box>
        </>
    )
}
