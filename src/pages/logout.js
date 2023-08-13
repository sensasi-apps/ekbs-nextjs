import Head from 'next/head'
import { useEffect } from 'react'
import axios from '@/lib/axios'

import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

import useAuth from '@/providers/Auth'

const logout = async mutate => {
    await axios.post('/logout').catch(error => {
        if (![401, 422].includes(error.response.status)) throw error
    })

    await mutate()
}

export default function Logout() {
    const { mutate } = useAuth()

    useEffect(() => {
        logout(mutate)
    }, [])

    return (
        <AuthLayout pageTitle="Logout">
            <Head>
                <title>{`Logout — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AuthLayout>
    )
}
