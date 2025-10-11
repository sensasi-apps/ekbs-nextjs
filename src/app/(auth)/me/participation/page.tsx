'use client'

// icons-materials
import Agriculture from '@mui/icons-material/Agriculture'
import BikeScooter from '@mui/icons-material/BikeScooter'
import ChevronRight from '@mui/icons-material/ChevronRight'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'
import Forest from '@mui/icons-material/Forest'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Warehouse from '@mui/icons-material/Warehouse'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// types
import { type ReactNode } from 'react'
// vendors
import useSWR from 'swr'
import BigNumberCard from '@/components/big-number-card'
import LineChartCard from '@/components/line-chart-card'
// components
import PageTitle from '@/components/page-title'
// utils
import Role from '@/enums/role'
// hooks
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import type SectionData from '@/types/section-data'

export interface ApiResponseType {
    palmBunches: SectionData
    palmBunchesDelivery: SectionData
    farmInputs: SectionData
}

/**
 * Page component that displays user participation based on their roles.
 * Participation mean the user's activities in the cooperative's business units.
 */
export default function Page() {
    const isUserHasRole = useIsAuthHasRole()

    const { data: { farmInputs, palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            isUserHasRole(Role.MEMBER) ? 'me/participations' : null,
        )

    return (
        <>
            <PageTitle title="Partisipasiku" />

            {isUserHasRole(Role.FARMER) && (
                <Section
                    data={palmBunches}
                    detailHref="/palm-bunches/rea-tickets"
                    iconTitle={<Forest />}
                    title="TBS — Jual"
                />
            )}

            {isUserHasRole(Role.COURIER) && (
                <Section
                    data={palmBunchesDelivery}
                    detailHref="/palm-bunches/rea-tickets"
                    iconTitle={<Forest />}
                    title="TBS — Angkut"
                />
            )}

            <Section
                data={farmInputs}
                detailHref="/farm-inputs/my-purchases"
                iconTitle={<Warehouse />}
                title="SAPRODI"
            />

            <ComingSoonSection iconTitle={<Agriculture />} title="Alat Berat" />

            <ComingSoonSection
                iconTitle={<CurrencyExchange />}
                title="Simpan Pinjam"
            />

            <ComingSoonSection
                iconTitle={<ShoppingCart />}
                title="Belayan Mart"
            />

            <ComingSoonSection
                iconTitle={<BikeScooter />}
                title="Belayan Spare Parts"
            />
        </>
    )
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
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            py={1.5}
            sx={{
                bgcolor: 'background.default',
                position: 'sticky',
                top: {
                    sm: '4em',
                    xs: '3.5em',
                },
                zIndex: 1,
            }}>
            <Box alignItems="center" display="flex" gap={1}>
                {iconTitle}

                <Typography component="div" variant="h6">
                    {title}
                </Typography>
            </Box>

            {detailHref && (
                <Button
                    color="success"
                    component="a"
                    endIcon={<ChevronRight />}
                    href={detailHref}
                    size="small"
                    variant="outlined">
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
            <SectionHeader iconTitle={iconTitle} title={title} />

            <Typography color="grey" mt={1} variant="body2">
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
                detailHref={detailHref}
                iconTitle={iconTitle}
                title={title}
            />
            <Grid container mb={1} spacing={2}>
                <Grid
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    {bigNumber1 && <BigNumberCard {...bigNumber1} />}
                </Grid>

                <Grid
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    {bigNumber2 && <BigNumberCard {...bigNumber2} />}
                </Grid>
            </Grid>
            {lineChart && (
                <LineChartCard
                    suffix={bigNumber1?.number1Suffix}
                    {...lineChart}
                />
            )}
        </Box>
    )
}
