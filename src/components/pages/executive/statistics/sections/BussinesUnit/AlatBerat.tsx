// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
// components
import StatCard from '@/components/StatCard'
// page components
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import LineChart from '@/components/Chart/Line/Line'
// charts
import HmTableCard from './AlatBerat/HmTableCard'
import WorkHmChartCard from './AlatBerat/WorkHmChartCard'
import GasPurchaseChartCard from './AlatBerat/GasPurchaseChartCard'

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
        <>
            <Heading3
                startIcon={<AgricultureIcon />}
                id="alat-berat"
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                Alat Berat
            </Heading3>

            <Grid2 container spacing={1.5}>
                <Grid2 xs={12} sm={4}>
                    <HmTableCard
                        data={data?.unit_current_hms}
                        isLoading={isLoading}
                    />
                </Grid2>

                <Grid2 xs={12} sm={8}>
                    <WorkHmChartCard
                        data={data?.unit_hm_working_monthly}
                        isLoading={isLoading}
                    />
                </Grid2>

                <Grid2 xs={12}>
                    <OmzetChartCard
                        data={data?.omzet_monthly}
                        isLoading={isLoading}
                    />
                </Grid2>

                <Grid2 xs={12}>
                    <GasPurchaseChartCard
                        data={data?.gas_purchases_monthly}
                        isLoading={isLoading}
                    />
                </Grid2>
            </Grid2>
        </>
    )
})

export default AlatBeratSubsection

function OmzetChartCard({
    data,
    isLoading,
}: {
    data: any
    isLoading: boolean | undefined
}) {
    return (
        <StatCard title="Omzet — Bulanan" isLoading={isLoading}>
            <LineChart currency data={data} />
        </StatCard>
    )
}
