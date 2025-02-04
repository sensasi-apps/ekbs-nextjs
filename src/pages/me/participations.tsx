// types
import type { ReactNode } from 'react'
// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid2 from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
// icons-materials
import Agriculture from '@mui/icons-material/Agriculture'
import BikeScooter from '@mui/icons-material/BikeScooter'
import ChevronRight from '@mui/icons-material/ChevronRight'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'
import Forest from '@mui/icons-material/Forest'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Warehouse from '@mui/icons-material/Warehouse'
// components
import LineChart from '@/components/Chart/Line'
import AuthLayout from '@/components/Layouts/AuthLayout'
import StatCard from '@/components/StatCard'
// utils
import useAuth from '@/providers/Auth'
import Role from '@/enums/Role'
import BigNumberCard, {
    type BigNumberCardProps,
} from '@/components/big-number-card'

export interface ApiResponseType {
    palmBunches: SectionData
    palmBunchesDelivery: SectionData
    farmInputs: SectionData
}

/**
 * Page component that displays user participations based on their roles.
 * Participations mean the user's activities in the cooperative's business units.
 */
export default function Page() {
    const { userHasRole } = useAuth()

    const { data: { farmInputs, palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            userHasRole(Role.MEMBER) ? 'me/participations' : null,
        )

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
                detailHref="/farm-inputs/purchases/me"
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
                <Grid2
                    size={{
                        xs: 12,
                        md: 6,
                    }}>
                    {bigNumber1 && <BigNumberCard {...bigNumber1} />}
                </Grid2>

                <Grid2
                    size={{
                        xs: 12,
                        md: 6,
                    }}>
                    {bigNumber2 && <BigNumberCard {...bigNumber2} />}
                </Grid2>
            </Grid2>
            {lineChart && (
                <LineChartCard
                    suffix={bigNumber1?.number1Suffix}
                    {...lineChart}
                />
            )}
        </Box>
    )
}

export function LineChartCard({
    title,
    data,
    collapsible,
    ...rest
}: SectionData['lineChart'] & { suffix?: string; collapsible?: boolean }) {
    const isHigherThanPrevious =
        data[data.length - 1].value > data[data.length - 2].value

    return (
        <StatCard
            title={title}
            collapsible={collapsible}
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
