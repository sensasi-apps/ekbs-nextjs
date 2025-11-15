// icons
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
// materials
import Button from '@mui/material/Button'
import type { Metadata } from 'next'
// components
import Fab from '@/components/fab'
import Link from '@/components/next-link'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle subtitle="Belayan Spare Parts" title="Penjualan" />

            <Button
                href="sales/report"
                startIcon={<FormatAlignJustifyIcon />}
                sx={{
                    mb: 3,
                }}>
                Laporan
            </Button>

            <PageClient />
            <Fab component={Link} href="sales/create" />
        </>
    )
}

export const metadata: Metadata = {
    title: `Penjualan Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
