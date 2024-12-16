// vendors
import { Avatar, Box, Card, CardContent, Fab, Typography } from '@mui/material'
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
// components
import { Background } from './background'
import ErrorCenter from '../Statuses/ErrorCenter'
import LoadingCenter from '../Statuses/LoadingCenter'
// providers
import useAuth from '@/providers/Auth'
import { ArrowBack } from '@mui/icons-material'

export default function GuestForm({
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
    const { replace, pathname, query, back, push } = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user && pathname !== '/maintenance') {
            const redirectTo = query.redirectTo

            if (redirectTo) {
                replace(redirectTo.toString())
            } else {
                replace('/dashboard')
            }
        }
    }, [user, replace, pathname, query])

    return (
        <Background
            slotProps={{
                wrapperBox: {
                    width: '100%',
                },
            }}>
            <Head>
                <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Box
                display="flex"
                width="100%"
                sx={{
                    justifyContent: {
                        sm: 'end',
                        md: 'space-between',
                    },
                }}>
                <Fab
                    variant="extended"
                    color="warning"
                    onClick={() =>
                        window.history.length > 1 ? back() : push('/')
                    }
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'none',
                            md: 'inline-flex',
                        },
                        backgroundColor:
                            'hsl(from var(--mui-palette-warning-dark) h s l / 20%)',
                        '&:hover': {
                            backgroundColor:
                                'hsl(from var(--mui-palette-warning-dark) h s l / 40%)',
                        },
                    }}>
                    <ArrowBack sx={{ mr: 1 }} />
                    Kembali
                </Fab>

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
        </Background>
    )
}
