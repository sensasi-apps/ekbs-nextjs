// types
import type { ReactNode } from 'react'
// vendors
import Head from 'next/head'
// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// components
import LayoutWithImageBackground from '@/app/_parts/layout-with-image-background'
import ErrorCenter from './Statuses/ErrorCenter'
import LoadingCenter from './Statuses/LoadingCenter'
import RedirectIfAuth from '@/components/redirect-if-auth'
// parts
import GuestBackButton from '@/components/guest-form-layout.back-button'

export default function GuestFormLayout({
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
        <LayoutWithImageBackground
            slotProps={{
                wrapperBox: {
                    width: '100%',
                },
            }}>
            <Head>
                <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <RedirectIfAuth />

            <Box
                display="flex"
                width="100%"
                sx={{
                    justifyContent: {
                        sm: 'end',
                        md: 'space-between',
                    },
                }}>
                <GuestBackButton />

                <Card
                    sx={{
                        maxWidth: '460px',
                        borderRadius: 8,
                        backgroundColor:
                            'hsl(from var(--mui-palette-AppBar-darkBg) h s l / 60%)',
                    }}>
                    <CardContent
                        sx={{
                            p: 3,
                        }}>
                        <Box display="flex" gap={3} alignItems="center">
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
                                    variant="h5"
                                    lineHeight="normal">
                                    {title}
                                </Typography>
                            </Box>
                        </Box>

                        <LoadingCenter isShow={isLoading} message={message} />

                        <ErrorCenter isShow={isError} message={message} />

                        <Box display={isLoading ? 'none' : 'block'} mt={2}>
                            {children}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </LayoutWithImageBackground>
    )
}
