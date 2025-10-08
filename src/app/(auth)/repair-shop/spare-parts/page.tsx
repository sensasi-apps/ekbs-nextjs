import type { Metadata } from 'next'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Suku Cadang" subtitle="Belayan Spare Parts" />

            <PageClient />
        </>
    )
}

export const metadata: Metadata = {
    title: `Suku Cadang Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
