import { memo } from 'react'
import LineChart from '@/components/Chart/Line'
import StatCard from '@/components/stat-card'

const MonthlyTotalMemberParticipationChartCard = memo(
    function MonthlyTotalMemberParticipationChartCard({
        data,
        isLoading,
    }: {
        data: unknown[] | undefined
        isLoading: boolean
    }) {
        return (
            <StatCard isLoading={isLoading} title="Partisipasi — Bulanan">
                <LineChart
                    data={data}
                    slotsProps={{
                        tooltip: {
                            labelFormatter: value => `Bulan ${value}`,
                        },
                    }}
                    suffix="org"
                />
            </StatCard>
        )
    },
)

export default MonthlyTotalMemberParticipationChartCard
