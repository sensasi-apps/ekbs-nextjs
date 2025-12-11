import PageTitleWithBackButton from '@/components/page-title-with-back-button'

export default async function Page({
    params,
}: {
    params: Promise<{ issue_id: string }>
}) {
    const issue_id = (await params).issue_id
    return (
        <>
            <PageTitleWithBackButton
                backHref="/issues"
                title={`Laporan Isu #${issue_id}`}
            />
        </>
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
