import AuthLayout from '@/components/Layouts/AuthLayout'
import Role from '@/enums/Role'
import { useRoleChecker } from '@/hooks/use-role-checker'
import axios from '@/lib/axios'
import { Button } from '@mui/material'

export default function Page() {
    if (!useRoleChecker(Role.SUPERMAN)) return null

    return (
        <AuthLayout title="BE Request Test">
            <Button onClick={() => axios.post('_/fe-integration-test')}>
                Post to /fe-integration-test
            </Button>
        </AuthLayout>
    )
}
