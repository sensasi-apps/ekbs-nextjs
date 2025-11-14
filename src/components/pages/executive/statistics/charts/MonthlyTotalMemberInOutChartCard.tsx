import LineChart from '@/components/charts/lines/basic'
import StatCard from '@/components/stat-card'

export default function MonthlyTotalMemberInOutChartCard({
    data,
    isLoading,
}: {
    data: unknown[] | undefined
    isLoading: boolean
}) {
    return (
        <StatCard isLoading={isLoading} title="Masuk-Keluar Anggota — Bulanan">
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
}
