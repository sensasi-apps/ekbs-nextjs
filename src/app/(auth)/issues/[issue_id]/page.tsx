import Container from '@mui/material/Container'
import PageTitleWithBackButton from '@/components/page-title-with-back-button'
import PageClient from './page-client'

export default async function Page({
    params,
}: {
    params: Promise<{ issue_id: string }>
}) {
    const issue_id = (await params).issue_id
    return (
        <Container>
            <PageTitleWithBackButton
                backHref="/issues"
                title={`Laporan Isu #${issue_id}`}
            />
            <PageClient />
        </Container>
    )
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ issue_id: string }>
}) {
    const issue_id = (await params).issue_id
    return {
        title: `Laporan Isu #${issue_id} — ${process.env.NEXT_PUBLIC_APP_NAME}`,
    }
}
