'use client'

import LinearProgress from '@mui/material/LinearProgress'
// materials
import Typography from '@mui/material/Typography'
// vendors
import type { AxiosError } from 'axios'
import Head from 'next/head'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import Profile from './_parts/profile'
// parts
import type PublicProfile from './_types/public-profile'

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
                <meta content="noindex,nofollow" name="robots" />
                <meta
                    content="no-store, no-cache, must-revalidate"
                    http-equiv="Cache-Control"
                />
                <meta content="no-cache" http-equiv="Pragma" />
                <meta content="0" http-equiv="Expires" />
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
