import PageTitle from '@/components/page-title'
import Crud from './crud'

export default function PalmBunchesDeliveryRates() {
    return (
        <>
            <PageTitle subtitle={subtitle} title={title} />

            <Crud />
        </>
    )
}

const title = 'Tarif Angkut'
const subtitle = 'Tandan Buah Segar'

export const metadata = {
    title: `${title} — ${subtitle} — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
