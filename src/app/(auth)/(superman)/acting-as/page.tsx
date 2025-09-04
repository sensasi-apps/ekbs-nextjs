'use client'

// types
import type AuthInfo from '@/modules/auth/types/auth-info'
// vendors
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from '@/lib/axios'
// components
import UserAutocomplete from '@/components/UserAutocomplete'
import useAuthInfoState from '@/hooks/use-auth-info-state'
import PageTitle from '@/components/page-title'

export default function Page() {
    const router = useRouter()
    const [, setCurrentAuthInfo] = useAuthInfoState()
    const [loading, setLoading] = useState(false)

    return (
        <>
            <PageTitle title="Acting As" />

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
        </>
    )
}
