// vendors
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
//
import AuthLayout from '@/components/Layouts/AuthLayout'
import Role from '@/enums/Role'
import { useRoleChecker } from '@/hooks/use-role-checker'

export default function Page() {
    if (!useRoleChecker(Role.SUPERMAN)) return null

    return (
        <AuthLayout title="BE Request Test">
            <Box display="flex" gap={2}>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => axios.post('_/fe-integration-test')}>
                    Post to /fe-integration-test
                </Button>

                <Button
                    size="large"
                    variant="contained"
                    onClick={() => {
                        throw new Error('Test Sentry Integration')
                    }}>
                    Throw New Error
                </Button>
            </Box>
        </AuthLayout>
    )
}
