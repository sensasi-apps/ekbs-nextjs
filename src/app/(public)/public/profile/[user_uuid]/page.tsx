'use client'

// vendors
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Head from 'next/head'
import useSWR from 'swr'
// materials
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
// parts
import type PublicProfile from './_types/public-profile'
import Profile from './_parts/profile'

export default function Page() {
    const { user_uuid } = useParams<{
        user_uuid: string
    }>()
    const [error, setError] = useState<string>()

    const { data: user } = useSWR<PublicProfile>(
        '/public/profile/' + user_uuid,
        null,
        {
            onError: (err: AxiosError) => {
                if (err.status === 404) {
                    notFound()
                } else {
                    setError(err.message)
                }
            },
        },
    )

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
