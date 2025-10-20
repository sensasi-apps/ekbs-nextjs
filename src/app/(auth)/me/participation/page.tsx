import type { Metadata } from 'next'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Partisipasiku" />

            <PageClient />
        </>
    )
}

export const metadata: Metadata = {
    title: `Partisipasiku — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
