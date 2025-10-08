import type { Metadata } from 'next'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Daftar Produk" subtitle="Belayan Mart" />

            <PageClient />
        </>
    )
}

export const metadata: Metadata = {
    title: `Daftar Produk Belayan Mart — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
