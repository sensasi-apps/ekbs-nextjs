// type
import type StatDataCache from '@/dataTypes/StatDataCache'
import type { ReactNode } from 'react'
// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import ForestIcon from '@mui/icons-material/Forest'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
import LineChart from '@/components/Chart/Line'
// page components
import Card from '@/components/pages/laporan-performa/Card'
// layout
import PublicLayout from '@/components/Layouts/PublicLayout'
import toDmy from '@/utils/toDmy'

export default function Stat() {
    const { data, isLoading } = useSWR<PerformanceDataType>('/performance-data')

    const {
        farmInputSaleRp,
        loanDisburseRp,
        memberTotal,
        memberParticipationTotal,
        palmBunchKg,
        rentIncomeRp,
    } = data ?? {}

    if (!isLoading && !data) {
        return 'Sistem mengalami gangguan, silakan coba lagi nanti'
    }

    const totalMember =
        typeof memberTotal?.value === 'number' ? memberTotal?.value : ''

    const currentTotalParticipation =
        typeof memberParticipationTotal?.value === 'object'
            ? memberParticipationTotal?.value.slice(-1)[0].value
            : 0

    const dataDate = memberTotal?.updated_at
        ? toDmy(memberTotal.updated_at)
        : '-'

    return (
        <PublicLayout
            backButton
            title={`Laporan Performa Koperasi Belayan Sejahtera —
        ${process.env.NEXT_PUBLIC_APP_NAME}`}>
            <Box mb={3}>
                <Typography variant="h4" component="h1">
                    Laporan Performa
                </Typography>
                <Typography variant="subtitle1" component="h2">
                    Koperasi Belayan Sejahtera
                </Typography>

                <Typography
                    variant="caption"
                    component="div"
                    display="flex"
                    gap={0.5}
                    color="GrayText"
                    alignItems="center">
                    Tanggal:
                    {isLoading ? (
                        <Skeleton variant="rounded" width="8em" />
                    ) : (
                        <span>{dataDate}</span>
                    )}
                </Typography>
            </Box>

            <Box display="flex" gap={4} flexDirection="column">
                <Box>
                    <Heading2 startIcon={<Diversity3Icon />}>Anggota</Heading2>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} sm={4}>
                            <Card
                                title="Partisipasi — Bulan Ini"
                                isLoading={isLoading}>
                                {!isLoading &&
                                    totalMember &&
                                    memberParticipationTotal && (
                                        <>
                                            <Typography
                                                variant="h2"
                                                component="div">
                                                {(
                                                    (currentTotalParticipation /
                                                        totalMember) *
                                                    100
                                                ).toFixed(0)}{' '}
                                                %
                                            </Typography>

                                            <Typography
                                                variant="subtitle2"
                                                component="div">
                                                {currentTotalParticipation}
                                                <Typography
                                                    variant="subtitle2"
                                                    color="GrayText"
                                                    component="span">
                                                    /{totalMember} org
                                                </Typography>
                                            </Typography>
                                        </>
                                    )}
                            </Card>
                        </Grid2>

                        <Grid2 xs={12} sm={8}>
                            <Card
                                title="Partisipasi — Bulanan"
                                isLoading={isLoading}>
                                <LineChart
                                    prefix="org"
                                    data={memberParticipationTotal?.value}
                                />
                            </Card>
                        </Grid2>
                    </Grid2>
                </Box>

                <Box display="flex" gap={3} flexDirection="column">
                    <Heading2 startIcon={<WorkIcon />}>Unit Bisnis</Heading2>
                    <Box>
                        <Heading3 startIcon={<ForestIcon />}>TBS</Heading3>
                        <Card title="Bobot — Bulanan" isLoading={isLoading}>
                            <LineChart prefix="kg" data={palmBunchKg?.value} />
                        </Card>
                    </Box>

                    <Box>
                        <Heading3 startIcon={<WarehouseIcon />}>
                            SAPRODI
                        </Heading3>
                        <Card title="Penjualan — Bulanan" isLoading={isLoading}>
                            <LineChart currency data={farmInputSaleRp?.value} />
                        </Card>
                    </Box>

                    <Box>
                        <Heading3 startIcon={<AgricultureIcon />}>
                            Penyewaan Alat Berat
                        </Heading3>
                        <Card title="Omzet — Bulanan" isLoading={isLoading}>
                            <LineChart currency data={rentIncomeRp?.value} />
                        </Card>
                    </Box>

                    <Box>
                        <Heading3 startIcon={<CurrencyExchangeIcon />}>
                            Simpan Pinjam
                        </Heading3>
                        <Card title="Pencairan — Bulanan" isLoading={isLoading}>
                            <LineChart currency data={loanDisburseRp?.value} />
                        </Card>
                    </Box>
                </Box>
            </Box>
        </PublicLayout>
    )
}

function Heading2({
    children,
    startIcon,
}: {
    children: ReactNode
    startIcon: ReactNode
}) {
    return (
        <Typography
            variant="h6"
            component="h2"
            display="flex"
            alignItems="center"
            gap={2}
            gutterBottom>
            {startIcon}
            {children}
        </Typography>
    )
}

function Heading3({
    children,
    startIcon,
}: {
    children: ReactNode
    startIcon: ReactNode
}) {
    return (
        <Typography
            component="h3"
            display="flex"
            alignItems="center"
            gap={2}
            mb={2}>
            {startIcon}
            {children}
        </Typography>
    )
}

type PerformanceDataType = {
    farmInputSaleRp: StatDataCache
    loanDisburseRp: StatDataCache
    memberTotal: StatDataCache
    memberParticipationTotal: StatDataCache
    palmBunchKg: StatDataCache
    rentIncomeRp: StatDataCache
}
