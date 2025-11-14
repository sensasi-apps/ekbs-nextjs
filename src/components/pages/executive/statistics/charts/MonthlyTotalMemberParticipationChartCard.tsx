import LineChart from '@/components/charts/lines/basic'
import StatCard from '@/components/stat-card'

export default function MonthlyTotalMemberParticipationChartCard({
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
}
