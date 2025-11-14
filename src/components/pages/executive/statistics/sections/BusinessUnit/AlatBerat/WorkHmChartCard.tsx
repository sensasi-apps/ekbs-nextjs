// components
import LineChart from '@/components/Chart/Line/Line'
import StatCard from '@/components/stat-card'
// utils
import formatNumber from '@/utils/format-number'
import getMuiColors from '@/utils/get-mui-colors'
import type { ApiResponseType } from '../AlatBerat'

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
        <StatCard isLoading={isLoading} title="Total HM Kerja — Bulanan">
            <LineChart
                data={data}
                lines={inventoryNames.map((name, i) => ({
                    dataKey: name,
                    stroke: colors[i],
                    type: 'monotone',
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
