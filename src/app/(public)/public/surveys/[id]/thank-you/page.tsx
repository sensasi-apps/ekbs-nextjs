import type { Metadata } from 'next'
import ThankYouPageClient from './page-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    return {
        description: 'Terima kasih telah mengisi survey',
        title: `Terima Kasih - Survey #${id}`,
    }
}

export default async function ThankYouPage() {
    return <ThankYouPageClient />
}
