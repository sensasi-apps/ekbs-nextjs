// types

// materials
import Typography from '@mui/material/Typography'
import type { TooltipProps } from 'recharts'
// vendors
import {
    CartesianGrid,
    Line,
    type LineProps,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
// utils
import formatNumber from '@/utils/format-number'

/**
 * LineChart component renders a line chart using Recharts library.
 * It displays a message if there is an error or no data available.
 */
export default function LineChart({
    data,
    lines,
    lineProps,
    prefix = '',
    suffix = '',
    slotsProps,
}: {
    data: unknown[] | undefined
    prefix?: string
    suffix?: string
    lines?: Omit<LineProps, 'ref'>[]
    xAxisDataKey?: string
    lineProps?: Omit<LineProps, 'ref'>
    slotsProps?: {
        tooltip?: TooltipProps<number, string>
    }
}) {
    if (!data) {
        return (
            <Typography
                color="text.secondary"
                textAlign="center"
                variant="body1">
                Terjadi kesalahan, silakan coba lagi nanti.
            </Typography>
        )
    }

    if (data.length === 0) {
        return (
            <Typography
                color="text.secondary"
                textAlign="center"
                variant="body1">
                Tidak ada data
            </Typography>
        )
    }

    const {
        type = 'monotone',
        dataKey = 'value',
        name = 'Total',
        stroke = 'var(--mui-palette-success-main)',
        ...restLineProps
    } = lineProps ?? {}

    return (
        <ResponsiveContainer minHeight={250} minWidth={500}>
            <RechartsLineChart
                data={data}
                margin={{
                    left: -10,
                    right: 20,
                    top: 5,
                }}
                style={{
                    margin: '0 auto',
                }}>
                <CartesianGrid
                    strokeDasharray="4 4"
                    style={{
                        stroke: 'var(--mui-palette-divider)',
                    }}
                />

                <XAxis dataKey="label" />

                <YAxis
                    tickFormatter={(value: number) =>
                        formatNumber(value, {
                            compactDisplay: 'short',
                            notation: 'compact',
                        })
                    }
                    type="number"
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--mui-palette-background-paper)',
                    }}
                    formatter={(value: number) =>
                        (prefix ? prefix + ' ' : '') +
                        formatNumber(value, {
                            compactDisplay: 'short',
                            notation: 'compact',
                        }).toString() +
                        (suffix ? ' ' + suffix : '')
                    }
                    {...(slotsProps?.tooltip ?? {})}
                />

                {lines ? (
                    lines.map((props, index) => <Line key={index} {...props} />)
                ) : (
                    <Line
                        dataKey={dataKey}
                        name={name}
                        stroke={stroke}
                        type={type}
                        {...restLineProps}
                    />
                )}
            </RechartsLineChart>
        </ResponsiveContainer>
    )
}
