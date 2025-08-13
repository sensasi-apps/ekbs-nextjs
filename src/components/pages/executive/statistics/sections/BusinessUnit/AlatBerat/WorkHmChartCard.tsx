import type { ApiResponseType } from '../AlatBerat'
// components
import LineChart from '@/components/Chart/Line/Line'
import StatCard from '@/components/StatCard'
// utils
import formatNumber from '@/utils/format-number'
import getMuiColors from '@/utils/get-mui-colors'

export default function WorkHmChartCard({
    data,
    isLoading,
}: {
    data: ApiResponseType['unit_hm_working_monthly'] | undefined
    isLoading: boolean | undefined
}) {
    const inventoryNames =
        data
            ?.map(item => Object.keys(item))
            .flat()
            .filter(
                (v, i, self) =>
                    !['label', 'label_value'].includes(v) &&
                    i === self.indexOf(v),
            )
            .sort() ?? []

    const colors = getMuiColors(inventoryNames.length, 400)

    return (
        <StatCard title="Total HM Kerja — Bulanan" isLoading={isLoading}>
            <LineChart
                data={data}
                lines={inventoryNames.map((name, i) => ({
                    type: 'monotone',
                    dataKey: name,
                    stroke: colors[i],
                }))}
                slotsProps={{
                    tooltip: {
                        formatter: (value: number) =>
                            `${formatNumber(value)} H.M`,
                        labelFormatter: (value: string) => `Bulan ke-${value}`,
                    },
                }}
            />
        </StatCard>
    )
}
