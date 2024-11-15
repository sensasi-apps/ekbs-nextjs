// types
import type { AuthInfo } from '@/@types/Data/auth-info'
// vendors
import { useState } from 'react'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import UserAutocomplete from '@/components/UserAutocomplete'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { setCurrentAuthInfo } from '@/providers/Auth/functions/setCurrentAuthInfo'

export default function ActingAs() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    return (
        <AuthLayout title="">
            <UserAutocomplete
                label="Pilih User"
                disabled={loading}
                onChange={(_, user) => {
                    if (!user) return

                    setLoading(true)

                    axios
                        .post<AuthInfo>(`/acting-as/${user.uuid}`)
                        .then(res => {
                            setCurrentAuthInfo(res.data)
                            router.push('/')
                        })
                        .catch(() => setLoading(false))
                }}
            />
        </AuthLayout>
    )
}
