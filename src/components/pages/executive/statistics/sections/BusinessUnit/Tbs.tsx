// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import LineChart from '@/components/Chart/Line/Line'
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// page components
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'
import FarmerGroupStatTable from './Tbs/FarmerGroupStatTable'

const TbsSubsection = memo(function TbsSubsection() {
    const { data, isLoading } = useSWR<ApiResponseType>(
        'executive/business-unit-section-data/palm-bunch',
    )

    return (
        <Grid2 container spacing={1.5}>
            <Grid2 xs={12} id="bobot" sx={SX_SCROLL_MARGIN_TOP}>
                <TbsWeightChartCard
                    data={data?.palm_bunch_weight_monthly_total}
                    isLoading={isLoading}
                />
            </Grid2>
            <Grid2 xs={12} id="penjualan-pelunasan" sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="penjualan-pelunasan — Bulanan"
                    isLoading={isLoading}>
                    <InOutLineChart
                        currency
                        data={data?.palm_bunch_sale_disburse_monthly_rp_total}
                        inboundAlias="Penjualan"
                        outboundAlias="Pelunasan"
                    />
                </StatCard>
            </Grid2>

            <Grid2
                xs={12}
                id="kontribusi-kelompok-tani"
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Kontribusi Kelompok Tani"
                    isLoading={isLoading}>
                    {data?.palm_bunch_stat_per_farmer_group && (
                        <FarmerGroupStatTable
                            data={data?.palm_bunch_stat_per_farmer_group}
                        />
                    )}
                </StatCard>
            </Grid2>
        </Grid2>
    )
})

export default TbsSubsection

export type ApiResponseType = {
    palm_bunch_weight_monthly_total: {
        n_kg: number
        deduction_kg: number
        incentive_kg: number
        label: string
    }[]
    palm_bunch_sale_disburse_monthly_rp_total: InOutLineChartProps['data']
    palm_bunch_stat_per_farmer_group: {
        farmer_group_name: string | null
        label: string
        label_value: number
        sum_kg: number
        sum_rp: number
    }[][]
}

function TbsWeightChartCard({
    data,
    isLoading,
}: {
    data: ApiResponseType['palm_bunch_weight_monthly_total'] | undefined
    isLoading: boolean
}) {
    return (
        <StatCard title="Bobot TBS" isLoading={isLoading}>
            <LineChart
                suffix="kg"
                data={data}
                lines={[
                    {
                        type: 'monotone',
                        dataKey: 'n_kg',
                        name: 'Bobot',
                        stroke: 'var(--mui-palette-primary-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'deduction_kg',
                        name: 'Potongan Grading',
                        stroke: 'var(--mui-palette-error-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'incentive_kg',
                        name: 'Insentif Grading',
                        stroke: 'var(--mui-palette-success-main)',
                    },
                ]}
            />
        </StatCard>
    )
}
