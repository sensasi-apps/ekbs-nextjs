// vendors

// materials
import Grid from '@mui/material/Grid'
import { memo } from 'react'
import useSWR from 'swr'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// components
import StatCard from '@/components/stat-card'
// constants
import SX_SCROLL_MARGIN_TOP from '../../SX_SCROLL_MARGIN_TOP'

const SppSubsection = memo(function SppSubsection() {
    const { data, isLoading } = useSWR<{
        disburse_collect_monthly_total: InOutLineChartProps['data']
        diff_monthly_total_based_on_proposed_at: InOutLineChartProps['data']
    }>('executive/business-unit-section-data/loan')

    return (
        <Grid container spacing={1.5}>
            <Grid
                id="pencairan-pengembalian"
                size={{ xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    isLoading={isLoading}
                    title="Pencairan-Pengembalian — Bulanan">
                    <InOutLineChart
                        currency
                        data={data?.disburse_collect_monthly_total}
                        inboundAlias="Pengembalian"
                        outboundAlias="Pencairan"
                    />
                </StatCard>
            </Grid>

            <Grid
                id="jasa-berdasarkan-bulan-pinjam"
                size={{ xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    isLoading={isLoading}
                    title="Jasa berdasarkan bulan pinjam">
                    <InOutLineChart
                        currency
                        data={data?.diff_monthly_total_based_on_proposed_at}
                        inboundAlias="Lunas"
                        outboundAlias="Belum Lunas"
                    />
                </StatCard>
            </Grid>
        </Grid>
    )
})

export default SppSubsection
