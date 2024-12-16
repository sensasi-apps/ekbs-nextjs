// materials
import { Button, Divider } from '@mui/material'
// icons
import { ArrowBack } from '@mui/icons-material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// components
import { Form } from '../components/pages/login/Form'
import { useHooks } from '@/components/pages/login/useHooks'
import GuestFormLayout from '@/components/Layouts/guest-form'
import CompleteCenter from '@/components/Statuses/CompleteCenter'

export default function LoginPage() {
    const { message, isLoading, isError, handleSubmit } = useHooks()

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

            {/* <Box display="flex" flexDirection="column" gap={2}> */}
            {/* disable google login for now due to offline auth */}
            {/* <Button
                href="/api/oauth/google"
                fullWidth
                color="inherit"
                variant="contained"
                startIcon={<GoogleIcon />}>
                Login dengan Google
            </Button> */}

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
