import LineChart from '@/components/charts/lines/basic'
import StatCard from '@/components/stat-card'
import type SectionData from '@/types/section-data'

export default function LineChartCard({
    title,
    data,
    collapsible,
    ...rest
}: SectionData['lineChart'] & { suffix?: string; collapsible?: boolean }) {
    const isHigherThanPrevious =
        data[data.length - 1].value > data[data.length - 2].value

    return (
        <StatCard
            collapsible={collapsible}
            color={isHigherThanPrevious ? 'success' : 'error'}
            title={title}>
            <LineChart
                {...rest}
                data={data}
                lineProps={{
                    stroke: isHigherThanPrevious
                        ? 'var(--mui-palette-success-main)'
                        : 'var(--mui-palette-error-main)',
                }}
            />
        </StatCard>
    )
}
