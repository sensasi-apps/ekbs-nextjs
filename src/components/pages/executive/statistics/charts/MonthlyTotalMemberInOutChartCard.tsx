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
        data: unknown[] | undefined
        isLoading: boolean
    }) {
        return (
            <StatCard
                isLoading={isLoading}
                title="Masuk-Keluar Anggota — Bulanan">
                <LineChart
                    data={data}
                    lines={[
                        {
                            dataKey: 'inbound',
                            name: 'Masuk',
                            stroke: 'var(--mui-palette-success-main)',
                            type: 'monotone',
                        },
                        {
                            dataKey: 'outbound',
                            name: 'Keluar',
                            stroke: 'var(--mui-palette-error-main)',
                            type: 'monotone',
                        },
                    ]}
                    slotsProps={{
                        tooltip: {
                            labelFormatter: value => `Bulan ${value}`,
                        },
                    }}
                />
            </StatCard>
        )
    },
)

export default MonthlyTotalMemberInOutChartCard
