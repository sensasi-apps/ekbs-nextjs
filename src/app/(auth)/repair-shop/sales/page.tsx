import Link from 'next/link'
// components
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'
import type { Metadata } from 'next'

export default function Page() {
    return (
        <>
            <PageTitle title="Penjualan" subtitle="Belayan Spare Parts" />
            <Fab href="sales/create" component={Link} />

            <PageClient />
        </>
    )
}

export const metadata: Metadata = {
    title: `Penjualan Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
