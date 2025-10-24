import Box, { type BoxProps } from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export default function InfoBox({
    data,
    loading,
    ...props
}: BoxProps & {
    data: {
        label: string
        value: ReactNode
    }[]
    loading?: boolean
}) {
    return (
        <Box component="table" {...props}>
            <tbody>
                {data.map(({ label, value }, index) => (
                    <tr key={index}>
                        <Typography component="td" variant="caption">
                            {label}
                        </Typography>

                        <td
                            style={{
                                paddingLeft: '1rem',
                            }}>
                            :
                        </td>

                        <Typography
                            component="td"
                            fontWeight="bold"
                            whiteSpace="nowrap">
                            {loading ? (
                                <Skeleton width={randomWidth()} />
                            ) : (
                                value
                            )}
                        </Typography>
                    </tr>
                ))}
            </tbody>
        </Box>
    )
}

function randomWidth(max = 8, min = 3) {
    return `${Math.random() * (max - min) + min}em`
}
