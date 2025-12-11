import PageTitleWithBackButton from '@/components/page-title-with-back-button'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitleWithBackButton title={PAGE_TITLE} />
            <PageClient />
        </>
    )
}

const PAGE_TITLE = 'Buat Laporan Isu'

export const metadata = {
    title: PAGE_TITLE,
}
