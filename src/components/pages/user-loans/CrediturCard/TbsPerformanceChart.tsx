import { useTheme } from '@mui/material/styles'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

export default function TbsPerformanceChart({ data }: { data: [] }) {
    const theme = useTheme()

    return (
        <div
            style={{
                height: '200px',
            }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis dataKey="monthName" />
                    <YAxis
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={value =>
                            new Intl.NumberFormat('id-ID', {
                                notation: 'compact',
                                compactDisplay: 'short',
                            }).format(value)
                        }
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.default,
                        }}
                        formatter={value =>
                            value.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0,
                            })
                        }
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="palmBunchesRp"
                        name="TBS"
                        stroke="#8884d8"
                    />
                    <Line
                        type="monotone"
                        dataKey="palmBunchDeliveriesRp"
                        name="Pengangkutan"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
