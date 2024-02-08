// vendors
import { memo } from 'react'
// components
import LineChart from '@/components/Chart/Line'
import StatCard from '@/components/StatCard'

const MonthlyTotalMemberInOutChartCard = memo(
    function MonthlyTotalMemberInOutChartCard({
        data,
        isLoading,
    }: {
        data: any[] | undefined
        isLoading: boolean
    }) {
        return (
            <StatCard
                title="Masuk-Keluar Anggota — Bulanan"
                isLoading={isLoading}>
                <LineChart
                    data={data}
                    slotsProps={{
                        tooltip: {
                            labelFormatter: value => `Bulan ${value}`,
                        },
                    }}
                    lines={[
                        {
                            type: 'monotone',
                            dataKey: 'inbound',
                            name: 'Masuk',
                            stroke: 'var(--mui-palette-success-main)',
                        },
                        {
                            type: 'monotone',
                            dataKey: 'outbound',
                            name: 'Keluar',
                            stroke: 'var(--mui-palette-error-main)',
                        },
                    ]}
                />
            </StatCard>
        )
    },
)

export default MonthlyTotalMemberInOutChartCard
