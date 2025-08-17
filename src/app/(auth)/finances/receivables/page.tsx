// materials
import Button from '@mui/material/Button'

import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Receivables() {
    return (
        <>
            <PageTitle title="Piutang" />

            <Button
                href="/finances/receivables/report"
                startIcon={<FormatAlignJustifyIcon />}
                size="small"
                sx={{
                    mb: 2,
                }}>
                Laporan
            </Button>

            <ReceivablesDatatable asManager />
        </>
    )
}
