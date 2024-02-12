// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// icons
// components
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import StatCard from '@/components/StatCard'
// page components
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'

const SaprodiSubsection = memo(function SaprodiSubsection() {
    const { data, isLoading } = useSWR<{
        sale_purchase_monthly_total: InOutLineChartProps['data']
    }>('executive/business-unit-section-data/farm-input')

    return (
        <Grid2 container spacing={1.5}>
            <Grid2 xs={12} id="penjualan-pembelian" sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Penjualan-Pembelian — Bulanan"
                    isLoading={isLoading}>
                    <InOutLineChart data={data?.sale_purchase_monthly_total} />
                </StatCard>
            </Grid2>
        </Grid2>
    )
})

export default SaprodiSubsection
