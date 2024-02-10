// types
import type { XAxisProps, TooltipProps } from 'recharts'
// vendors
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineProps,
} from 'recharts'
// materials
import Typography from '@mui/material/Typography'
// utils
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

export default function LineChart({
    data,
    prefix = '',
    lines,
    lineProps,
    currency,
    slotsProps,
}: {
    data?: any[]
    prefix?: string
    lines?: Omit<LineProps, 'ref'>[]
    xAxisDataKey?: string
    lineProps?: Omit<LineProps, 'ref'>
    currency?: boolean
    slotsProps?: {
        xAxis?: XAxisProps
        tooltip?: TooltipProps<any, any>
    }
}) {
    if (!data || typeof data === 'number') {
        return (
            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center">
                Terjadi kesalahan, silakan coba lagi nanti.
            </Typography>
        )
    }

    if (data.length === 0) {
        return (
            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center">
                Tidak ada data
            </Typography>
        )
    }

    const proccessedPrefix = prefix ? ' ' + prefix : ''
    const {
        type = 'monotone',
        dataKey = 'value',
        name = 'Total',
        stroke = 'var(--mui-palette-success-main)',
        ...restLineProps
    } = lineProps ?? {}

    return (
        <ResponsiveContainer
            minHeight={200}
            minWidth={600}
            style={{
                overflow: 'hidden',
            }}>
            <RechartsLineChart
                data={data}
                margin={{
                    left: -20,
                }}>
                <XAxis dataKey="label" {...(slotsProps?.xAxis ?? {})} />

                <YAxis
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value: number) =>
                        formatNumber(value, {
                            notation: 'compact',
                            compactDisplay: 'short',
                        })
                    }
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--mui-palette-background-paper)',
                    }}
                    formatter={(value: number) =>
                        currency
                            ? numberToCurrency(value)
                            : formatNumber(value) + proccessedPrefix
                    }
                    {...(slotsProps?.tooltip ?? {})}
                />

                {lines ? (
                    lines.map((props, index) => <Line key={index} {...props} />)
                ) : (
                    <Line
                        type={type}
                        dataKey={dataKey}
                        name={name}
                        stroke={stroke}
                        {...restLineProps}
                    />
                )}
            </RechartsLineChart>
        </ResponsiveContainer>
    )
}
