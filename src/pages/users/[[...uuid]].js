import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import UsersMainPageContent from '@/components/Users/MainPageContent'

export default function users() {
    return (
        <AuthLayout title="Pengguna">
            <Head>
                <title>{`Pengguna — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <UsersMainPageContent />
        </AuthLayout>
    )
}
