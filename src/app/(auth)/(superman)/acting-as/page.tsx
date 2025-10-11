'use client'

// vendors
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PageTitle from '@/components/page-title'
// components
import UserAutocomplete from '@/components/user-autocomplete'
import useAuthInfoState from '@/hooks/use-auth-info-state'
import axios from '@/lib/axios'
// types
import type AuthInfo from '@/modules/user/types/auth-info'

export default function Page() {
    const router = useRouter()
    const [, setCurrentAuthInfo] = useAuthInfoState()
    const [loading, setLoading] = useState(false)

    return (
        <>
            <PageTitle title="Acting As" />

            <UserAutocomplete
                disabled={loading}
                label="Pilih User"
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
