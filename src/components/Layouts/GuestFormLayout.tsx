// vendors
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
// etc
import ErrorCenter from '../Statuses/ErrorCenter'
import FooterBox from './FooterBox'
import LoadingCenter from '../Statuses/LoadingCenter'
import useAuth from '@/providers/Auth'

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
    const { replace, pathname, query } = useRouter()
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
        <div>
            <Head>
                <title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100vh',
                    p: 8,
                }}>
                <Box display="flex" gap={2}>
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
                        <Typography
                            component="div"
                            variant="body2"
                            gutterBottom>
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </Typography>

                        <Typography
                            component="div"
                            variant="h5"
                            lineHeight={0.5}>
                            {title}
                        </Typography>
                    </Box>
                </Box>

                <LoadingCenter isShow={isLoading} message={message} />

                <ErrorCenter isShow={isError} message={message} />

                <Box display={isLoading ? 'none' : 'block'} mt={2}>
                    {children}
                </Box>

                <FooterBox />
            </Container>
        </div>
    )
}
