'use client'

// icons
import ArrowBack from '@mui/icons-material/ArrowBack'
import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// materials
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
// vendors
import { useIsOnline } from 'react-use-is-online'
import GuestWithFormSubLayout from '@/app/(guest)/(with-form)/_parts/guest-with-form-sub-layout'
import RedirectIfAuth from '@/components/redirect-if-auth'
// components
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import LoginForm from './_parts/form'
// parts
import useHooks from './_parts/use-hooks'

export default function Page() {
    const { message, isLoading, isError, handleSubmit } = useHooks()
    const { isOffline } = useIsOnline()

    return (
        <GuestWithFormSubLayout
            icon={<LockOutlinedIcon />}
            isError={isError}
            isLoading={isLoading}
            message={message}
            title="Login">
            <RedirectIfAuth />

            <CompleteCenter
                isShow={!isError && Boolean(message)}
                message={message}
            />

            <LoginForm handleSubmit={handleSubmit} />

            <Divider
                sx={{
                    my: 2,
                }}>
                Atau
            </Divider>

            <Button
                color="inherit"
                disabled={isOffline}
                fullWidth
                href="/oauth/google"
                startIcon={<GoogleIcon />}
                sx={{
                    mb: 2,
                }}
                variant="contained">
                Login dengan Google
            </Button>

            <Button
                color="info"
                fullWidth
                href="/"
                startIcon={<ArrowBack />}
                variant="text">
                Kembali ke halaman depan
            </Button>
        </GuestWithFormSubLayout>
    )
}
