'use client'

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
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// type
import type { ReactNode } from 'react'
import useSWR from 'swr'
// components
import LineChart from '@/components/Chart/Line'
import StatCard, { type StatCardProps } from '@/components/StatCard'
import BigNumber from '@/components/StatCard/BigNumber'
// utils
import toDmy from '@/utils/to-dmy'

export default function PageClient() {
    const {
        data: {
            lastGeneratedAt,
            data: {
                currentMemberTotal,
                monthlyCafeIncomeRps,
                monthlyFarmInputIncomeRps,
                monthlyLoanDisburseRps,
                monthlyMartIncomeRps,
                monthlyMemberParticipation,
                monthlyPalmBunchKgs,
                monthlyRentIncomeRps,
                monthlyRepairShopIncomeRps,
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
            monthlyMemberParticipation: StatDataItem[]
            monthlyPalmBunchKgs: StatDataItem[]
            monthlyRentIncomeRps: StatDataItem[]
            monthlyRepairShopIncomeRps: StatDataItem[]
        }
    }>('performance-data')

    return (
        <>
            <Box mb={3}>
                <Typography component="h1" variant="h4">
                    Laporan Performa
                </Typography>
                <Typography component="h2" variant="subtitle1">
                    Koperasi Belayan Sejahtera
                </Typography>

                <Typography
                    alignItems="center"
                    color="GrayText"
                    component="div"
                    display="flex"
                    gap={0.5}
                    variant="caption">
                    Tanggal pemutakhiran data:
                    {isLoading ? (
                        <Skeleton variant="rounded" width="8em" />
                    ) : (
                        <span>
                            {lastGeneratedAt ? toDmy(lastGeneratedAt) : '-'}
                        </span>
                    )}
                </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={4}>
                <Box>
                    <Heading2 startIcon={<Diversity3Icon />}>Anggota</Heading2>

                    <Grid container spacing={2}>
                        <Grid
                            size={{
                                sm: 4,
                                xs: 12,
                            }}>
                            <CurrentParticipation
                                currentMemberTotal={currentMemberTotal}
                                currentMonthTotalParticipation={
                                    monthlyMemberParticipation?.[
                                        monthlyMemberParticipation.length - 1
                                    ].value
                                }
                                isLoading={isLoading}
                            />
                        </Grid>

                        <Grid
                            size={{
                                sm: 8,
                                xs: 12,
                            }}>
                            <StatCard
                                isLoading={isLoading}
                                title="Partisipasi — Bulanan">
                                <LineChart
                                    data={monthlyMemberParticipation}
                                    suffix="org"
                                />
                            </StatCard>
                        </Grid>
                    </Grid>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                    <Heading2 startIcon={<WorkIcon />}>Unit Bisnis</Heading2>

                    <StatCardBox
                        businessUnitName="TBS"
                        icon={<ForestIcon />}
                        isLoading={isLoading}
                        statName="Bobot — Bulanan">
                        <LineChart
                            data={monthlyPalmBunchKgs?.map(item => ({
                                ...item,
                                value: item.value / 1000,
                            }))}
                            suffix="ton"
                        />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="SAPRODI"
                        icon={<WarehouseIcon />}
                        isLoading={isLoading}
                        statName="Omzet — Bulanan">
                        <LineChart
                            data={monthlyFarmInputIncomeRps}
                            lines={[
                                {
                                    dataKey: 'total',
                                    name: 'Total',
                                    stroke: 'var(--mui-palette-success-main)',
                                    type: 'monotone',
                                },
                                {
                                    dataKey: 'cash',
                                    name: 'Tunai',
                                    stroke: 'var(--mui-palette-primary-main)',
                                    type: 'monotone',
                                },
                                {
                                    dataKey: 'installment1',
                                    name: 'Angsur 1x',
                                    stroke: 'var(--mui-palette-warning-main)',
                                    type: 'monotone',
                                },
                                {
                                    dataKey: 'installment2',
                                    name: 'Angsur 2x',
                                    stroke: 'var(--mui-palette-error-main)',
                                    type: 'monotone',
                                },
                            ]}
                            prefix="Rp"
                        />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="Penyewaan Alat Berat"
                        icon={<AgricultureIcon />}
                        isLoading={isLoading}
                        statName="Omzet — Bulanan">
                        <LineChart data={monthlyRentIncomeRps} prefix="Rp" />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="Simpan Pinjam"
                        icon={<CurrencyExchangeIcon />}
                        isLoading={isLoading}
                        statName="Pencairan — Bulanan">
                        <LineChart data={monthlyLoanDisburseRps} prefix="Rp" />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="Belayan Mart"
                        icon={<ShoppingCart />}
                        isLoading={isLoading}
                        statName="Omzet — Bulanan">
                        <LineChart data={monthlyMartIncomeRps} prefix="Rp" />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="Belayan Spare Part"
                        icon={<BikeScooter />}
                        isLoading={isLoading}
                        statName="Omzet — Bulanan">
                        <LineChart
                            data={monthlyRepairShopIncomeRps}
                            prefix="Rp"
                        />
                    </StatCardBox>

                    <StatCardBox
                        businessUnitName="Kopi Depan Kantor"
                        icon={<Coffee />}
                        isLoading={isLoading}
                        statName="Omzet — Bulanan">
                        <LineChart data={monthlyCafeIncomeRps} prefix="Rp" />
                    </StatCardBox>
                </Box>
            </Box>
        </>
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
            alignItems="center"
            component="h2"
            display="flex"
            gap={2}
            gutterBottom
            variant="h6">
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
            alignItems="center"
            component="h3"
            display="flex"
            gap={2}
            mb={2}>
            {startIcon}
            {children}
        </Typography>
    )
}

function StatCardBox({
    statName,
    businessUnitName,
    icon,
    isLoading,
    children,
    color,
}: {
    statName: string
    icon: ReactNode
    businessUnitName: string
    isLoading: boolean
    children: ReactNode
    color?: StatCardProps['color']
}) {
    return (
        <Box>
            <Heading3 startIcon={icon}>{businessUnitName}</Heading3>

            <StatCard color={color} isLoading={isLoading} title={statName}>
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
            isLoading={isLoading}
            primary={percentage.toFixed(0) + ' %'}
            secondary={detail}
            title="Partisipasi — Bulan Ini"
        />
    )
}
