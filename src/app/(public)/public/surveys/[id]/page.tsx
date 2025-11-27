import type { Metadata } from 'next'
import FillSurveyPageClient from './page-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    return {
        description: 'Isi survey dengan jujur dan lengkap',
        title: `Isi Survey #${id} - EKBS`,
    }
}

export default async function FillSurveyPage({ params }: Props) {
    const { id } = await params

    return <FillSurveyPageClient surveyId={parseInt(id)} />
}
