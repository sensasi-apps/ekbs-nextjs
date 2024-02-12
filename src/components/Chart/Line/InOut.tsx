import { memo } from 'react'
import LineChart from './Line'

const InOutLineChart = memo(function InOutLineChart({
    data,
    currency,
}: InOutLineChartProps) {
    return (
        <LineChart
            currency={currency}
            data={data}
            lines={[
                {
                    type: 'monotone',
                    dataKey: 'inbound',
                    name: 'Masuk',
                    stroke: 'var(--mui-palette-success-main)',
                },
                {
                    type: 'monotone',
                    dataKey: 'outbound',
                    name: 'Keluar',
                    stroke: 'var(--mui-palette-error-main)',
                },
            ]}
        />
    )
})

export default InOutLineChart

export type InOutLineChartProps = {
    data:
        | {
              label: string
              label_value: string
              inbound: number
              outbound: number
          }[]
        | undefined
    currency?: boolean
}
