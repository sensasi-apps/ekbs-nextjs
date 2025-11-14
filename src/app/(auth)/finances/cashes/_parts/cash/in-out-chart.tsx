// types

// vendors
import useSWR from 'swr'
import LineChart from '@/components/charts/lines/basic'
import type { StatCardProps } from '@/components/stat-card'
// components
import StatCard from '@/components/stat-card'

export default function InOutCashChart({
    title = 'Saldo Masuk-Keluar — Bulanan',
    data: dataProp,
    isLoading: isLoadingProp,
    disableAutoFetch,
    ...props
}: Omit<StatCardProps, 'title'> & {
    title?: string
} & (
        | {
              disableAutoFetch: true
              data: InOutCashChartDataType | undefined
              isLoading: boolean
          }
        | {
              disableAutoFetch?: false
              data?: never
              isLoading?: never
          }
    )) {
    const { data, isLoading } = useSWR<InOutCashChartDataType>(
        disableAutoFetch ? null : 'cashes/in-out-chart-data',
    )

    return (
        <StatCard
            isLoading={isLoading || isLoadingProp}
            title={title}
            {...props}>
            <LineChart
                data={disableAutoFetch ? dataProp : data}
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
                prefix="Rp"
                slotsProps={{
                    tooltip: {
                        labelFormatter: value => `Bulan ${value}`,
                    },
                }}
            />
        </StatCard>
    )
}

export type InOutCashChartDataType = {
    label: string
    inbound: number
    outbound: number
}[]
