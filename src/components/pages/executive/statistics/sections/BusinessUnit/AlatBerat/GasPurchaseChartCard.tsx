// types

// components
import LineChart from '@/components/Chart/Line/Line'
import StatCard from '@/components/StatCard'
// utils
import formatNumber from '@/utils/format-number'
import getMuiColors from '@/utils/get-mui-colors'
import type { ApiResponseType } from '../AlatBerat'

export default function GasPurchaseChartCard({
    data,
    isLoading,
}: {
    data: ApiResponseType['gas_purchases_monthly'] | undefined
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
        <StatCard isLoading={isLoading} title="Total Pembelian BBM — Bulanan">
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
                            `${formatNumber(value)} L`,
                        labelFormatter: (value: string) => `Bulan ke-${value}`,
                    },
                }}
            />
        </StatCard>
    )
}
