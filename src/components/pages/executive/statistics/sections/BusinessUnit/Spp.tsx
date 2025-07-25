// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Grid2'
// components
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'

const SppSubsection = memo(function SppSubsection() {
    const { data, isLoading } = useSWR<{
        disburse_collect_monthly_total: InOutLineChartProps['data']
        diff_monthly_total_based_on_proposed_at: InOutLineChartProps['data']
    }>('executive/business-unit-section-data/loan')

    return (
        <Grid2 container spacing={1.5}>
            <Grid2
                size={{ xs: 12 }}
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

            <Grid2
                size={{ xs: 12 }}
                id="jasa-berdasarkan-bulan-pinjam"
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Jasa berdasarkan bulan pinjam"
                    isLoading={isLoading}>
                    <InOutLineChart
                        currency
                        data={data?.diff_monthly_total_based_on_proposed_at}
                        inboundAlias="Lunas"
                        outboundAlias="Belum Lunas"
                    />
                </StatCard>
            </Grid2>
        </Grid2>
    )
})

export default SppSubsection
