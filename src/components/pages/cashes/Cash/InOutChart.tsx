// types
import type { StatCardProps } from '@/components/StatCard'
// vendors
import useSWR from 'swr'
// components
import StatCard from '@/components/StatCard'
import LineChart from '@/components/Chart/Line'

export default function InOutCashChart({
    title = 'Saldo Masuk-Keluar — Bulanan',
    ...props
}: Omit<StatCardProps, 'title'> & {
    title?: string
}) {
    const { data, isLoading } = useSWR('cashes/in-out-chart-data')

    return (
        <StatCard title={title} isLoading={isLoading} {...props}>
            <LineChart
                currency
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
                        name: 'Pendapatan',
                        stroke: 'var(--mui-palette-success-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'outbound',
                        name: 'Pengeluaran',
                        stroke: 'var(--mui-palette-error-main)',
                    },
                ]}
            />
        </StatCard>
    )
}
