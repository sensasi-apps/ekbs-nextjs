import type { Metadata } from 'next'
import PageClient from './page-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    return {
        title: `Detail Survey #${id} — ${process.env.NEXT_PUBLIC_APP_NAME}`,
    }
}

export default async function Page() {
    return <PageClient />
}
