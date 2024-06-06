// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
// icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// components
import { Form } from '../components/pages/login/Form'
import { OtherButtons } from '@/components/pages/login/OtherButtons'
import { useHooks } from '@/components/pages/login/useHooks'
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'
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

            <Box display="flex" flexDirection="column" gap={2}>
                <OtherButtons />
            </Box>
        </GuestFormLayout>
    )
}
