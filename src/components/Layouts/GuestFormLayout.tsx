import Head from 'next/head'
import { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
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

const GuestFormLayout: FC<{
    children: ReactNode
    icon: ReactNode
    isLoading?: boolean
    isError?: boolean
    message?: string
    title: string
}> = ({
    children,
    title,
    icon,
    isLoading = false,
    isError = false,
    message,
}) => {
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

            <Container component="main" maxWidth="xs">
                <Box
                    mt={6}
                    display="flex"
                    flexDirection="column"
                    alignItems="center">
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: () => {
                                if (isLoading) return 'primary.main'
                                if (isError) return 'error.main'
                            },
                        }}>
                        {icon}
                    </Avatar>

                    <Typography component="h1" variant="body2">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </Typography>

                    <Typography component="h1" variant="h5">
                        {title}
                    </Typography>

                    <LoadingCenter isShow={isLoading} message={message} />

                    <ErrorCenter isShow={isError} message={message} />

                    <Box display={isLoading ? 'none' : 'block'} mt={2}>
                        {children}
                    </Box>

                    <FooterBox />
                </Box>
            </Container>
        </div>
    )
}

export default GuestFormLayout
