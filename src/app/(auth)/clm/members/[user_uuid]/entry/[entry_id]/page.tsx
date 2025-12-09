import Box from '@mui/material/Box'
import type { Metadata } from 'next'
import BackButton from '@/components/back-button'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <Box mb={3}>
                <BackButton />
            </Box>

            <PageClient />
        </>
    )
}

type Props = {
    params: Promise<{ user_uuid: string; entry_id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { entry_id } = await params

    return {
        title: `Entri #${entry_id} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    }
}
