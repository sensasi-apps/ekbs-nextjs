import { memo } from 'react'
import LineChart from './Line'

const InOutLineChart = memo(function InOutLineChart({
    data,
    currency,
    inboundAlias = 'Masuk',
    outboundAlias = 'Keluar',
}: InOutLineChartProps) {
    return (
        <LineChart
            currency={currency}
            data={data}
            lines={[
                {
                    type: 'monotone',
                    dataKey: 'inbound',
                    name: inboundAlias,
                    stroke: 'var(--mui-palette-success-main)',
                },
                {
                    type: 'monotone',
                    dataKey: 'outbound',
                    name: outboundAlias,
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
    inboundAlias?: string
    outboundAlias?: string
}
