import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function FarmInputsProducts() {
    return (
        <>
            <PageTitle subtitle="SAPRODI" title="Produk" />

            <PageClient />
        </>
    )
}

export const metadata = {
    title: `Produk SAPRODI — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
