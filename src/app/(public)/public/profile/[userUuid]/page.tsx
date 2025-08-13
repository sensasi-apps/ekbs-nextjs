'use client'

// vendors
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
// materials
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
// libs
import myAxios from '@/lib/axios'
// parts
import type PublicProfile from './_types/public-profile'
import Profile from './_parts/profile'

export default function Page({
    params,
}: {
    params: Promise<{ userUuid: string }>
}) {
    const { replace } = useRouter()
    const [userUuid, setUserUuid] = useState<string>()
    const [user, setUser] = useState<PublicProfile>()
    const [error, setError] = useState<string>()

    params.then(({ userUuid }) => setUserUuid(userUuid))

    useEffect(() => {
        if (userUuid) {
            myAxios
                .get<PublicProfile>('/public/profile/' + userUuid)
                .then(res => setUser(res.data))
                .catch((err: AxiosError) => {
                    if (err.status === 404) {
                        replace('/404')
                    } else {
                        setError(err.message)
                    }
                })
        }
    }, [userUuid, replace])

    return (
        <>
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
        </>
    )
}
