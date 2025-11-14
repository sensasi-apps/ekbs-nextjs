import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function PalmBunchesReaPaymentsPage() {
    return (
        <>
            <PageTitle title="Pembayaran dari REA" />

            <PageClient />
        </>
    )
}

const title = 'Pembayaran dari REA'
const subtitle = 'Tandan Buah Segar'

export const metadata = {
    title: `${title} — ${subtitle} — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
