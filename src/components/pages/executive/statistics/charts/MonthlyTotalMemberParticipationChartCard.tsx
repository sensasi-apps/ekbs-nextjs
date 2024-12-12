import LineChart from '@/components/Chart/Line'
import StatCard from '@/components/StatCard'
import { memo } from 'react'

const MonthlyTotalMemberParticipationChartCard = memo(
    function MonthlyTotalMemberParticipationChartCard({
        data,
        isLoading,
    }: {
        data: unknown[] | undefined
        isLoading: boolean
    }) {
        return (
            <StatCard title="Partisipasi — Bulanan" isLoading={isLoading}>
                <LineChart
                    slotsProps={{
                        tooltip: {
                            labelFormatter: value => `Bulan ${value}`,
                        },
                    }}
                    suffix="org"
                    data={data}
                />
            </StatCard>
        )
    },
)

export default MonthlyTotalMemberParticipationChartCard
