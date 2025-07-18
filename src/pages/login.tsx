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
import { Form } from '../components/pages/login/Form'
import { useHooks } from '@/components/pages/login/useHooks'
import GuestFormLayout from '@/components/Layouts/guest-form'
import CompleteCenter from '@/components/Statuses/CompleteCenter'

export default function LoginPage() {
    const { message, isLoading, isError, handleSubmit } = useHooks()
    const { isOffline } = useIsOnline()

    return (
        <GuestFormLayout
            title="Login"
            icon={<LockOutlinedIcon />}
            isLoading={isLoading}
            isError={isError}
            message={message}>
            <CompleteCenter
                isShow={!isError && Boolean(message)}
                message={message}
            />

            <Form handleSubmit={handleSubmit} />

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
                href="/oauth/google"
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
            {/* </Box> */}
        </GuestFormLayout>
    )
}
