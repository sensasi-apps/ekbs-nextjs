import type { Metadata } from 'next'
// components
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle
                title="Laporan Penjualan"
                subtitle="Belayan Spare Parts"
            />

            <PageClient />
        </>
    )
}

export const metadata: Metadata = {
    title: `Laporan Penjualan Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
