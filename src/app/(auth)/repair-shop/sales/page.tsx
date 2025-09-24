import type { Metadata } from 'next'
import Link from 'next/link'
// materials
import Button from '@mui/material/Button'
// icons
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
// components
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Penjualan" subtitle="Belayan Spare Parts" />

            <Button
                href="sales/report"
                startIcon={<FormatAlignJustifyIcon />}
                sx={{
                    mb: 3,
                }}>
                Laporan
            </Button>

            <PageClient />
            <Fab href="sales/create" component={Link} />
        </>
    )
}

export const metadata: Metadata = {
    title: `Penjualan Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
