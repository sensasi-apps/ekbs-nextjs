// vendors

// materials
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import PageTitle from '@/components/page-title'
// modules
import ClearCacheModalAndButton from '@/modules/settings/components/clear-cache-modal-and-button'
import SettingsGroup from '@/modules/settings/components/settings-group'

export const metadata: Metadata = {
    title: `Pengaturan — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default function Page() {
    return (
        <>
            <PageTitle title="Pengaturan" />

            <SettingsGroup title="Data Aplikasi">
                <Typography color="text.secondary" mb={2} variant="body2">
                    Hapus data sementara dan cache aplikasi untuk membebaskan
                    ruang penyimpanan dan mengatasi masalah.
                </Typography>

                <ClearCacheModalAndButton />
            </SettingsGroup>
        </>
    )
}
