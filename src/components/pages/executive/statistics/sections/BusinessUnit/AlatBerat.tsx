// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Grid2'
// icons
// components
import StatCard from '@/components/StatCard'
// page components
import LineChart from '@/components/Chart/Line/Line'
// charts
import HmTableCard from './AlatBerat/HmTableCard'
import WorkHmChartCard from './AlatBerat/WorkHmChartCard'
import GasPurchaseChartCard from './AlatBerat/GasPurchaseChartCard'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'

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
        <Grid2 container spacing={1.5}>
            <Grid2
                size={{ xs: 12, sm: 4 }}
                id="hm-unit"
                sx={SX_SCROLL_MARGIN_TOP}>
                <HmTableCard
                    data={data?.unit_current_hms}
                    isLoading={isLoading}
                />
            </Grid2>

            <Grid2
                size={{ xs: 12, sm: 8 }}
                id="total-hm-kerja"
                sx={SX_SCROLL_MARGIN_TOP}>
                <WorkHmChartCard
                    data={data?.unit_hm_working_monthly}
                    isLoading={isLoading}
                />
            </Grid2>

            <Grid2 size={{ xs: 12 }} id="omzet" sx={SX_SCROLL_MARGIN_TOP}>
                <OmzetChartCard
                    data={data?.omzet_monthly ?? []}
                    isLoading={isLoading}
                />
            </Grid2>

            <Grid2
                size={{ xs: 12 }}
                id="pembelian-bbm"
                sx={SX_SCROLL_MARGIN_TOP}>
                <GasPurchaseChartCard
                    data={data?.gas_purchases_monthly}
                    isLoading={isLoading}
                />
            </Grid2>
        </Grid2>
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
        <StatCard title="Omzet — Bulanan" isLoading={isLoading}>
            <LineChart prefix="Rp" data={data} />
        </StatCard>
    )
}
