// vendors
import useSWR from 'swr'
// components
import Card from '@/components/pages/laporan-performa/Card'
import LineChart from '@/components/Chart/Line/Line'

export default function FarmerPerformanceChart() {
    const { data, isLoading } = useSWR('palm-bunches/performances')

    return (
        <Card title="" isLoading={isLoading}>
            <LineChart
                prefix="kg"
                data={data}
                slotsProps={{
                    xAxis: {
                        label: {
                            value: 'Minggu ke-',
                            offset: -1,
                            position: 'insideBottom',
                        },
                    },
                    tooltip: {
                        labelFormatter: value => `Minggu Ke-${value}`,
                    },
                }}
                lines={[
                    {
                        type: 'monotone',
                        dataKey: 'n_kg',
                        name: 'Bobot',
                        stroke: 'var(--mui-palette-primary-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'deduction_kg',
                        name: 'Potongan',
                        stroke: 'var(--mui-palette-error-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'incentive_kg',
                        name: 'Insentif',
                        stroke: 'var(--mui-palette-success-main)',
                    },
                ]}
            />
        </Card>
    )
}
