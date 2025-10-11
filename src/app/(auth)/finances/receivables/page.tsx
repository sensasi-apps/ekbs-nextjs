// materials

import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import Button from '@mui/material/Button'
// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export const metadata = {
    title: `Piutang — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default function Receivables() {
    return (
        <>
            <PageTitle title="Piutang" />

            <Button
                href="/finances/receivables/report"
                size="small"
                startIcon={<FormatAlignJustifyIcon />}
                sx={{
                    mb: 2,
                }}>
                Laporan
            </Button>

            <ReceivablesDatatable asManager />
        </>
    )
}
