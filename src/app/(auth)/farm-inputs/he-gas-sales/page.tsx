import type { Metadata } from 'next'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

/**
 * gas sales to heavy equipment rental unit
 */
export default function FarmInputHeGasSales() {
    return (
        <>
            <PageTitle title={title} />

            <PageClient />
        </>
    )
}

const title = 'Penjualan BBM ke Alat Berat'

export const metadata: Metadata = {
    title: `${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
