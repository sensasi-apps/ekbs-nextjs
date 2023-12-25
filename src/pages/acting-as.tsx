// vendors
import { useState } from 'react'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
import axios from '@/lib/axios'

export default function ActingAs() {
    const [loading, setLoading] = useState(false)

    return (
        <AuthLayout title="">
            <UserAutocomplete
                disabled={loading}
                onChange={(_, user) => {
                    if (!user) return

                    setLoading(true)
                    return axios
                        .post(`/acting-as/${user.uuid}`)
                        .then(() => (window.location.href = '/dashboard'))
                        .catch(() => setLoading(false))
                }}
            />
        </AuthLayout>
    )
}
