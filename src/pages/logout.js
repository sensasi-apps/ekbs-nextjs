import { useAuth } from '@/hooks/auth'

import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function logout() {
    const { logout } = useAuth({ middleware: 'auth' })

    if (logout) {
        logout()
    }

    return (
        <AppLayout pageTitle="Logout">
            <Head>
                <title>{`Logout — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AppLayout>
    )
}
