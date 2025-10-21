import type { Metadata } from 'next'
import PageClient from './page-client'

export default function Page() {
    return <PageClient />
}

export const metadata: Metadata = {
    title: `Laporan Performa — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
