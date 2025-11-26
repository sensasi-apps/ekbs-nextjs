import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Survei" />

            <PageClient />
        </>
    )
}

export const metadata = {
    title: `Survei — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
