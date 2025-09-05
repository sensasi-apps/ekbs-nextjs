import LineChart from '@/components/Chart/Line'
import StatCard from '@/components/StatCard'
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
            title={title}
            collapsible={collapsible}
            color={isHigherThanPrevious ? 'success' : 'error'}>
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
