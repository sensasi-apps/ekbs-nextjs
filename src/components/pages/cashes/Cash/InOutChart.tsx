// vendors
import useSWR from 'swr'
// components
import Card from '@/components/pages/laporan-performa/Card'
import LineChart from '@/components/Chart/Line'

export default function InOutCashChart() {
    const { data, isLoading } = useSWR('cashes/in-out-chart-data')

    return (
        <Card
            title="Pendapatan-Pengeluaran Bulanan"
            isLoading={isLoading}
            collapsible>
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
        </Card>
    )
}
