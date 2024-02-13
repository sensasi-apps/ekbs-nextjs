// vendors
import { memo } from 'react'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'
import useSWR from 'swr'

const SppSubsection = memo(function SppSubsection() {
    const { data, isLoading } = useSWR<{
        disburse_collect_monthly_total: InOutLineChartProps['data']
    }>('executive/business-unit-section-data/loan')

    return (
        <Grid2 container spacing={1.5}>
            <Grid2
                xs={12}
                id="pencairan-pengembalian"
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Pencairan-Pengembalian — Bulanan"
                    isLoading={isLoading}>
                    <InOutLineChart
                        currency
                        data={data?.disburse_collect_monthly_total}
                        inboundAlias="Pengembalian"
                        outboundAlias="Pencairan"
                    />
                </StatCard>
            </Grid2>
        </Grid2>
    )
})

export default SppSubsection
