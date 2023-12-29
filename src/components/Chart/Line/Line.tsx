import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineProps,
} from 'recharts'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import formatNumber from '@/utils/formatNumber'
import StatDataCache from '@/dataTypes/StatDataCache'
import numberToCurrency from '@/utils/numberToCurrency'

export default function LineChart({
    data,
    prefix = '',
    lines,
    lineProps,
    currency,
}: {
    data?: StatDataCache['value']
    prefix?: string
    lines?: Omit<LineProps, 'ref'>[]
    xAxisDataKey?: string
    lineProps?: Omit<LineProps, 'ref'>
    currency?: boolean
}) {
    if (!data || typeof data === 'number') {
        return (
            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center">
                Terjadi kesalahan, silakan coba lagi
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
        <Box height="200px" overflow="hidden">
            <ResponsiveContainer>
                <RechartsLineChart data={data}>
                    <XAxis dataKey="label" />

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
                            backgroundColor:
                                'var(--mui-palette-background-paper)',
                        }}
                        formatter={(value: number) =>
                            currency
                                ? numberToCurrency(value)
                                : formatNumber(value) + proccessedPrefix
                        }
                    />

                    {lines ? (
                        lines.map((props, index) => (
                            <Line key={index} {...props} />
                        ))
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
        </Box>
    )
}
