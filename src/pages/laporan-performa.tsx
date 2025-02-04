// type
import type { ReactNode } from 'react'
// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import AgricultureIcon from '@mui/icons-material/Agriculture'
import BikeScooter from '@mui/icons-material/BikeScooter'
import Coffee from '@mui/icons-material/Coffee'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import ForestIcon from '@mui/icons-material/Forest'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// components
import LineChart from '@/components/Chart/Line'
import BigNumber from '@/components/StatCard/BigNumber'
import PublicLayout from '@/components/Layouts/PublicLayout'
import StatCard, { type StatCardProps } from '@/components/StatCard'
// utils
import toDmy from '@/utils/toDmy'

export default function Stat() {
    const {
        data: {
            lastGeneratedAt,
            data: {
                currentMemberTotal,
                // monthlyCafeIncomeRps,
                monthlyFarmInputIncomeRps,
                monthlyLoanDisburseRps,
                monthlyMartIncomeRps,
                monthlyMemberParticipations,
                monthlyPalmBunchKgs,
                monthlyRentIncomeRps,
                // monthlyRepairShopIncomeRps,
            },
        } = {
            data: {},
        },
        isLoading,
    } = useSWR<{
        lastGeneratedAt: string
        data: {
            currentMemberTotal: number
            monthlyCafeIncomeRps: StatDataItem[]
            monthlyFarmInputIncomeRps: StatDataItem[]
            monthlyLoanDisburseRps: StatDataItem[]
            monthlyMartIncomeRps: StatDataItem[]
            monthlyMemberParticipations: StatDataItem[]
            monthlyPalmBunchKgs: StatDataItem[]
            monthlyRentIncomeRps: StatDataItem[]
            monthlyRepairShopIncomeRps: StatDataItem[]
        }
    }>('performance-data')

    return (
        <PublicLayout
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
                    Pengikinian terakhir tanggal:
                    {isLoading ? (
                        <Skeleton variant="rounded" width="8em" />
                    ) : (
                        <span>
                            {lastGeneratedAt ? toDmy(lastGeneratedAt) : '-'}
                        </span>
                    )}
                </Typography>
            </Box>
            <Box display="flex" gap={4} flexDirection="column">
                <Box>
                    <Heading2 startIcon={<Diversity3Icon />}>Anggota</Heading2>

                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 4,
                            }}>
                            <CurrentParticipation
                                currentMemberTotal={currentMemberTotal}
                                currentMonthTotalParticipation={
                                    monthlyMemberParticipations?.[
                                        monthlyMemberParticipations.length - 1
                                    ].value
                                }
                                isLoading={isLoading}
                            />
                        </Grid2>

                        <Grid2
                            size={{
                                xs: 12,
                                sm: 8,
                            }}>
                            <StatCard
                                title="Partisipasi — Bulanan"
                                isLoading={isLoading}>
                                <LineChart
                                    suffix="org"
                                    data={monthlyMemberParticipations}
                                />
                            </StatCard>
                        </Grid2>
                    </Grid2>
                </Box>

                <Box display="flex" gap={3} flexDirection="column">
                    <Heading2 startIcon={<WorkIcon />}>Unit Bisnis</Heading2>

                    <StatCardBox
                        bussinesUnitName="TBS"
                        statName="Bobot — Bulanan"
                        icon={<ForestIcon />}
                        isLoading={isLoading}>
                        <LineChart
                            suffix="ton"
                            data={monthlyPalmBunchKgs?.map(item => ({
                                ...item,
                                value: item.value / 1000,
                            }))}
                        />
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="SAPRODI"
                        statName="Omzet — Bulanan"
                        icon={<WarehouseIcon />}
                        isLoading={isLoading}>
                        <LineChart
                            prefix="Rp"
                            data={monthlyFarmInputIncomeRps}
                            lines={[
                                {
                                    type: 'monotone',
                                    dataKey: 'total',
                                    name: 'Total',
                                    stroke: 'var(--mui-palette-success-main)',
                                },
                                {
                                    type: 'monotone',
                                    dataKey: 'cash',
                                    name: 'Tunai',
                                    stroke: 'var(--mui-palette-primary-main)',
                                },
                                {
                                    type: 'monotone',
                                    dataKey: 'installment1',
                                    name: 'Angsur 1x',
                                    stroke: 'var(--mui-palette-warning-main)',
                                },
                                {
                                    type: 'monotone',
                                    dataKey: 'installment2',
                                    name: 'Angsur 2x',
                                    stroke: 'var(--mui-palette-error-main)',
                                },
                            ]}
                        />
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="Penyewaan Alat Berat"
                        statName="Omzet — Bulanan"
                        icon={<AgricultureIcon />}
                        isLoading={isLoading}>
                        <LineChart prefix="Rp" data={monthlyRentIncomeRps} />
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="Simpan Pinjam"
                        statName="Pencairan — Bulanan"
                        icon={<CurrencyExchangeIcon />}
                        isLoading={isLoading}>
                        <LineChart prefix="Rp" data={monthlyLoanDisburseRps} />
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="Belayan Mart"
                        statName="Omzet — Bulanan"
                        icon={<ShoppingCart />}
                        isLoading={isLoading}>
                        <LineChart prefix="Rp" data={monthlyMartIncomeRps} />
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="Belayan Spare Part"
                        statName="Omzet — Bulanan"
                        icon={<BikeScooter />}
                        color="warning"
                        isLoading={isLoading}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            textAlign="center">
                            Akan segera hadir
                        </Typography>
                    </StatCardBox>

                    <StatCardBox
                        bussinesUnitName="Kopi Depan Kantor"
                        statName="Omzet — Bulanan"
                        color="warning"
                        icon={<Coffee />}
                        isLoading={isLoading}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            textAlign="center">
                            Akan segera hadir
                        </Typography>
                    </StatCardBox>
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

function StatCardBox({
    statName,
    bussinesUnitName,
    icon,
    isLoading,
    children,
    color,
}: {
    statName: string
    icon: ReactNode
    bussinesUnitName: string
    isLoading: boolean
    children: ReactNode
    color?: StatCardProps['color']
}) {
    return (
        <Box>
            <Heading3 startIcon={icon}>{bussinesUnitName}</Heading3>

            <StatCard title={statName} isLoading={isLoading} color={color}>
                {children}
            </StatCard>
        </Box>
    )
}

interface StatDataItem {
    label: string
    value: number
}

function CurrentParticipation({
    currentMemberTotal = 0,
    currentMonthTotalParticipation = 0,
    isLoading,
}: {
    currentMemberTotal?: number
    currentMonthTotalParticipation?: number
    isLoading: boolean
}) {
    const percentage = currentMemberTotal
        ? (currentMonthTotalParticipation / currentMemberTotal) * 100
        : 0

    const detail = `${currentMonthTotalParticipation}/${currentMemberTotal} org`

    return (
        <BigNumber
            title="Partisipasi — Bulan Ini"
            isLoading={isLoading}
            primary={percentage.toFixed(0) + ' %'}
            secondary={detail}
        />
    )
}
