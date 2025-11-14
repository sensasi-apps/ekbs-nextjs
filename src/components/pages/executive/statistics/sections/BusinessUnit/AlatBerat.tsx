// vendors

// materials
import Grid from '@mui/material/Grid'
import { memo } from 'react'
import useSWR from 'swr'
// page components
import LineChart from '@/components/charts/lines/basic'
// icons
// components
import StatCard from '@/components/stat-card'
// constants
import SX_SCROLL_MARGIN_TOP from '../../SX_SCROLL_MARGIN_TOP'
import GasPurchaseChartCard from './AlatBerat/GasPurchaseChartCard'
// charts
import HmTableCard from './AlatBerat/HmTableCard'
import WorkHmChartCard from './AlatBerat/WorkHmChartCard'

export type ApiResponseType = {
    unit_current_hms: {
        name: string
        hm: number
    }[]

    omzet_monthly: {
        label: string
        label_value: string
        value: number
    }[]

    unit_hm_working_monthly: {
        label: string
        label_value: string
        [inventoryName: string]: string | number
    }[]

    gas_purchases_monthly: {
        label: string
        label_value: string
        [inventoryName: string]: string | number
    }[]
}

const AlatBeratSubsection = memo(function AlatBeratSubsection() {
    const { data, isLoading } = useSWR<ApiResponseType>(
        'executive/business-unit-section-data/alat-berat',
    )

    return (
        <Grid container spacing={1.5}>
            <Grid
                id="hm-unit"
                size={{ sm: 4, xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <HmTableCard
                    data={data?.unit_current_hms}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                id="total-hm-kerja"
                size={{ sm: 8, xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <WorkHmChartCard
                    data={data?.unit_hm_working_monthly}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid id="omzet" size={{ xs: 12 }} sx={SX_SCROLL_MARGIN_TOP}>
                <OmzetChartCard
                    data={data?.omzet_monthly ?? []}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                id="pembelian-bbm"
                size={{ xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <GasPurchaseChartCard
                    data={data?.gas_purchases_monthly}
                    isLoading={isLoading}
                />
            </Grid>
        </Grid>
    )
})

export default AlatBeratSubsection

function OmzetChartCard({
    data,
    isLoading,
}: {
    data: ApiResponseType['omzet_monthly']
    isLoading: boolean | undefined
}) {
    return (
        <StatCard isLoading={isLoading} title="Omzet — Bulanan">
            <LineChart data={data} prefix="Rp" />
        </StatCard>
    )
}
