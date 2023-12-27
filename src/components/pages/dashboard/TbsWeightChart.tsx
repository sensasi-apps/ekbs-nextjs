// vendors
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
// materials
import Typography from '@mui/material/Typography'
// utils
import formatNumber from '@/utils/formatNumber'

export default function TbsWeightChart({ data }: { data: any[] }) {
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

    return (
        <div
            style={{
                height: '200px',
                overflow: 'hidden',
            }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis dataKey="label" />

                    <YAxis
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={value => formatNumber(value)}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-bg-paper)',
                        }}
                        formatter={(value: number) =>
                            formatNumber(value) + ' kg'
                        }
                    />

                    <Line
                        type="monotone"
                        dataKey="weight"
                        name="Total"
                        stroke="#8884d8"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
