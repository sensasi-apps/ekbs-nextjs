// materials
import Button from '@mui/material/Button'

import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Receivables() {
    return (
        <AuthLayout title="Piutang">
            <Button
                href="receivables/report"
                startIcon={<FormatAlignJustifyIcon />}
                size="small"
                sx={{
                    mb: 2,
                }}>
                Laporan
            </Button>

            <ReceivablesDatatable asManager />
        </AuthLayout>
    )
}
