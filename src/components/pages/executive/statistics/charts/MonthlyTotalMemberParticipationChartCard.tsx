import LineChart from '@/components/Chart/Line'
import StatCard from '@/components/StatCard'
import { memo } from 'react'

const MonthlyTotalMemberParticipationChartCard = memo(
    function MonthlyTotalMemberParticipationChartCard({
        data,
        isLoading,
    }: {
        data: any[] | undefined
        isLoading: boolean
    }) {
        return (
            <StatCard title="Partisipasi — Bulanan" isLoading={isLoading}>
                <LineChart prefix="org" data={data} />
            </StatCard>
        )
    },
)

export default MonthlyTotalMemberParticipationChartCard
