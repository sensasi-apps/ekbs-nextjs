import { useContext, useEffect } from 'react'

import axios from '@/lib/axios'
import AppContext from '@/providers/App'

import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import { useRouter } from 'next/router'

export default function Logout() {
    const router = useRouter()

    const {
        auth: { error, mutate },
    } = useContext(AppContext)

    const logout = async () => {
        if (!error) {
            await axios.post('/logout')
            mutate()
        }

        window.localStorage.removeItem('isLoggedIn')

        if (router.query.error) {
            router.push('/login?error=' + btoa('Akun tidak aktif'))
        } else {
            router.push('/login')
        }
    }

    useEffect(() => {
        logout()
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
