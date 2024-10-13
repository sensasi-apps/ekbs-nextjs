import { Button } from '@mui/material'
import useAuth from '@/providers/Auth'
import { useRouter } from 'next/router'
import Role from '@/enums/Role'

export default function SentryIntegrationTestPage() {
    const { user, userHasRole } = useAuth()
    const { back } = useRouter()

    if (!user) {
        return ''
    }

    if (!userHasRole(Role.SUPERMAN)) {
        return back()
    }

    return userHasRole(Role.SUPERMAN) ? (
        <Button
            size="large"
            variant="contained"
            sx={{
                m: 5,
            }}
            onClick={() => {
                throw new Error('Test Sentry Integration')
            }}>
            Test Sentry Integration
        </Button>
    ) : null
}
