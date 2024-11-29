// types
import type { ReactNode } from 'react'
// vendors
import {
    Agriculture,
    BikeScooter,
    ChevronRight,
    CurrencyExchange,
    Forest,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Warehouse,
} from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import LineChart from '@/components/Chart/Line'
import AuthLayout from '@/components/Layouts/AuthLayout'
import StatCard from '@/components/StatCard'
// utils
import formatNumber from '@/utils/formatNumber'
import useSWR from 'swr'
import useAuth from '@/providers/Auth'
import Role from '@/enums/Role'

export default function Page() {
    const { userHasRole } = useAuth()

    const { data: { farmInputs, palmBunchesDelivery, palmBunches } = {} } =
        useSWR<{
            palmBunches: SectionData
            palmBunchesDelivery: SectionData
            farmInputs: SectionData
        }>(userHasRole(Role.MEMBER) ? 'me/participations' : null)

    if (!userHasRole(Role.MEMBER)) return <NonMemberPage />

    return (
        <AuthLayout title="Partisipasi Anda">
            {userHasRole(Role.FARMER) && (
                <Section
                    title="TBS — Jual"
                    iconTitle={<Forest />}
                    detailHref="/palm-bunches/rea-tickets"
                    data={palmBunches}
                />
            )}

            {userHasRole(Role.COURIER) && (
                <Section
                    title="TBS — Angkut"
                    iconTitle={<Forest />}
                    detailHref="/palm-bunches/rea-tickets"
                    data={palmBunchesDelivery}
                />
            )}

            <Section
                title="SAPRODI"
                iconTitle={<Warehouse />}
                data={farmInputs}
                detailHref="/me/farm-inputs/purchases"
            />

            <ComingSoonSection title="Alat Berat" iconTitle={<Agriculture />} />

            <ComingSoonSection
                title="Simpan Pinjam"
                iconTitle={<CurrencyExchange />}
            />

            <ComingSoonSection
                title="Belayan Mart"
                iconTitle={<ShoppingCart />}
            />

            <ComingSoonSection
                title="Belayan Spare Parts"
                iconTitle={<BikeScooter />}
            />
        </AuthLayout>
    )
}

function NonMemberPage() {
    return (
        <AuthLayout title="Partisipasi Anda">
            <Typography variant="body2" color="grey" mt={1}>
                Halaman ini hanya dapat diakses oleh anggota koperasi
            </Typography>
        </AuthLayout>
    )
}

interface SectionData {
    bigNumber1: BigNumberCardProps
    bigNumber2: BigNumberCardProps
    lineChart: {
        title: string
        currency?: boolean
        data: { label: string; value: number }[]
    }
}

function SectionHeader({
    title,
    iconTitle,
    detailHref,
}: {
    title: string
    iconTitle: ReactNode
    detailHref?: string
}) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1.5}
            sx={{
                position: 'sticky',
                top: {
                    xs: '3.5em',
                    sm: '4em',
                },
                bgcolor: 'background.default',
                zIndex: 1,
            }}>
            <Box display="flex" alignItems="center" gap={1}>
                {iconTitle}

                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </Box>

            {detailHref && (
                <Button
                    component="a"
                    href={detailHref}
                    endIcon={<ChevronRight />}
                    size="small"
                    variant="outlined"
                    color="success">
                    Rincian
                </Button>
            )}
        </Box>
    )
}

function ComingSoonSection({
    title,
    iconTitle,
}: {
    title: string
    iconTitle: ReactNode
}) {
    return (
        <Box mb={3}>
            <SectionHeader title={title} iconTitle={iconTitle} />

            <Typography variant="body2" color="grey" mt={1}>
                Akan hadir
            </Typography>
        </Box>
    )
}

function Section({
    title,
    iconTitle,
    detailHref,
    data,
}: {
    title: string
    iconTitle: ReactNode
    detailHref: string
    data?: SectionData
}) {
    const { bigNumber1, bigNumber2, lineChart } = data ?? {}

    return (
        <Box mb={3}>
            <SectionHeader
                title={title}
                iconTitle={iconTitle}
                detailHref={detailHref}
            />

            <Grid2 container spacing={2} mb={1}>
                <Grid2 xs={12} md={6}>
                    {bigNumber1 && <BigNumberCard {...bigNumber1} />}
                </Grid2>

                <Grid2 xs={12} md={6}>
                    {bigNumber2 && <BigNumberCard {...bigNumber2} />}
                </Grid2>
            </Grid2>

            {lineChart && (
                <LineChartCard
                    prefix={bigNumber1?.number1Suffix}
                    {...lineChart}
                />
            )}
        </Box>
    )
}

interface BigNumberCardProps {
    title: string
    number1: number
    number2: number
    timeUnit: string
    number1Suffix?: string
    number1Prefix?: string
}

function BigNumberCard({
    title,
    number1,
    number2,
    number1Suffix,
    number1Prefix,
    timeUnit,
}: BigNumberCardProps) {
    const isHigher = number1 > number2
    const diffPercentage = Math.abs((number1 - number2) / number2) * 100

    return (
        <StatCard
            disableFullscreen
            title={title}
            color={isHigher ? 'success' : 'error'}>
            <Typography variant="h3" mb={1} component="div">
                {number1Prefix}
                {formatNumber(number1, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                    notation: 'compact',
                })}
                {number1Suffix}
            </Typography>

            <Typography
                variant="subtitle1"
                component="div"
                color="grey"
                display="flex"
                lineHeight="unset"
                alignItems="center"
                gap={1}>
                <Box
                    lineHeight="unset"
                    component="span"
                    sx={{
                        fontWeight: 'bold',
                        color: isHigher ? 'success.dark' : 'error.dark',
                    }}
                    display="flex"
                    alignItems="center"
                    gap={0.5}>
                    {formatNumber(diffPercentage, {
                        maximumFractionDigits: 1,
                    })}
                    % {isHigher ? <TrendingUp /> : <TrendingDown />}
                </Box>
                lebih {isHigher ? 'tinggi' : 'rendah'} dari {timeUnit} lalu
            </Typography>
        </StatCard>
    )
}

function LineChartCard({
    title,
    data,
    ...rest
}: SectionData['lineChart'] & { prefix?: string }) {
    const isHigherThanPrevious =
        data[data.length - 1].value > data[data.length - 2].value

    return (
        <StatCard
            title={title}
            color={isHigherThanPrevious ? 'success' : 'error'}>
            <LineChart
                {...rest}
                data={data}
                lineProps={{
                    stroke: isHigherThanPrevious
                        ? 'var(--mui-palette-success-main)'
                        : 'var(--mui-palette-error-main)',
                }}
            />
        </StatCard>
    )
}
