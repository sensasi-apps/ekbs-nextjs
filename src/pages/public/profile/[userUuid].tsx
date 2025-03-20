// vendors
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
// materials
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
// libs
import myAxios from '@/lib/axios'
// components
import PublicLayout from '@/components/Layouts/PublicLayout'
// features
import type PublicProfile from '@/features/user--public-profile/types/public-profile'
import Profile from '@/features/user--public-profile/components/profile'

export default function ProfilePage() {
    const { query, replace } = useRouter()
    const [user, setUser] = useState<PublicProfile>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (query.userUuid && !user) {
            myAxios
                .get<PublicProfile>('/public/profile/' + query.userUuid)
                .then(res => {
                    setUser(res.data)
                })
                .catch((err: AxiosError) => {
                    if (err.status === 404) {
                        replace('/404')
                    } else {
                        setError(err.message)
                    }
                })
        }
    }, [query.userUuid, user, replace])

    return (
        <PublicLayout title={process.env.NEXT_PUBLIC_APP_NAME ?? 'EKBS'}>
            <Head>
                <meta name="robots" content="noindex,nofollow" />
                <meta
                    http-equiv="Cache-Control"
                    content="no-store, no-cache, must-revalidate"
                />
                <meta http-equiv="Pragma" content="no-cache" />
                <meta http-equiv="Expires" content="0" />
            </Head>

            {!user && !error && <LinearProgress />}

            {error && (
                <>
                    <Typography color="error">Terjadi Kesalahan: </Typography>

                    <Typography color="error">{error}</Typography>
                </>
            )}

            {user && <Profile data={user} />}
        </PublicLayout>
    )
}
