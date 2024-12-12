// types
import type { StatCardProps } from '@/components/StatCard'
// vendors
import useSWR from 'swr'
// components
import StatCard from '@/components/StatCard'
import LineChart from '@/components/Chart/Line'

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
            title={title}
            isLoading={isLoading || isLoadingProp}
            {...props}>
            <LineChart
                prefix="Rp"
                data={disableAutoFetch ? dataProp : data}
                slotsProps={{
                    tooltip: {
                        labelFormatter: value => `Bulan ${value}`,
                    },
                }}
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
        </StatCard>
    )
}

export type InOutCashChartDataType = {
    label: string
    inbound: number
    outbound: number
}[]
