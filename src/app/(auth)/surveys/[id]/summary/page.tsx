import { Metadata } from 'next'
import SummaryPageClient from './page-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    return {
        title: `Rangkuman Survey #${id} - EKBS`,
    }
}

export default async function SummaryPage({ params }: Props) {
    const { id } = await params

    return <SummaryPageClient surveyId={parseInt(id)} />
}
