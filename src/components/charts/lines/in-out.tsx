import LineChart from './basic'

export default function InOutLineChart({
    data,
    inboundAlias = 'Masuk',
    outboundAlias = 'Keluar',
}: InOutLineChartProps) {
    return (
        <LineChart
            data={data}
            lines={[
                {
                    dataKey: 'inbound',
                    name: inboundAlias,
                    stroke: 'var(--mui-palette-success-main)',
                    type: 'monotone',
                },
                {
                    dataKey: 'outbound',
                    name: outboundAlias,
                    stroke: 'var(--mui-palette-error-main)',
                    type: 'monotone',
                },
            ]}
            prefix="Rp"
        />
    )
}

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
