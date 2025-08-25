'use client'

// vendors
import { useIsOnline } from 'react-use-is-online'
// materials
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
// icons
import ArrowBack from '@mui/icons-material/ArrowBack'
import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// components
import GuestWithFormSubLayout from '@/app/(guest)/_parts/guest-with-form-sub-layout'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
// parts
import useHooks from './_parts/use-hooks'
import LoginForm from './_parts/form'

export default function Page() {
    const { message, isLoading, isError, handleSubmit } = useHooks()
    const { isOffline } = useIsOnline()

    return (
        <GuestWithFormSubLayout
            title="Login"
            icon={<LockOutlinedIcon />}
            isLoading={isLoading}
            isError={isError}
            message={message}>
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
                sx={{
                    mb: 2,
                }}
                href={process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/google'}
                fullWidth
                color="inherit"
                variant="contained"
                disabled={isOffline}
                startIcon={<GoogleIcon />}>
                Login dengan Google
            </Button>

            <Button
                href="/"
                fullWidth
                variant="text"
                color="info"
                startIcon={<ArrowBack />}>
                Kembali ke halaman depan
            </Button>
        </GuestWithFormSubLayout>
    )
}
