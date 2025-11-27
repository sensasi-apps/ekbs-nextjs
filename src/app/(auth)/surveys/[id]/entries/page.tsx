import type { Metadata } from 'next'
import EntriesPageClient from './page-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    return {
        title: `Entri Survey #${id} - EKBS`,
    }
}

export default async function EntriesPage({ params }: Props) {
    const { id } = await params

    return <EntriesPageClient surveyId={parseInt(id)} />
}
