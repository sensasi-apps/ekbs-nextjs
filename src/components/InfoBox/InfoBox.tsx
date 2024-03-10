import type { ReactNode } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

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
                        <Typography variant="caption" component="td">
                            {label}
                        </Typography>

                        <td
                            style={{
                                paddingLeft: '1rem',
                            }}>
                            :
                        </td>

                        <Typography
                            fontWeight="bold"
                            component="td"
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
    return Math.random() * (max - min) + min + 'em'
}
