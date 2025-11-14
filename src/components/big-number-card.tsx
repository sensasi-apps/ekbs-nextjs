// vendors

// icons-materials
import TrendingDown from '@mui/icons-material/TrendingDown'
import TrendingUp from '@mui/icons-material/TrendingUp'
import Box from '@mui/material/Box'
// materials
import type { CardProps } from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import formatNumber from '@/utils/format-number'
//
import StatCard from './StatCard'

export default function BigNumberCard({
    title,
    number1,
    number2,
    number1Suffix,
    number1Prefix,
    timeUnit,
    collapsible,
    sx,
}: BigNumberCardProps) {
    const isHigher = number1 > (number2 ?? 0)

    return (
        <StatCard
            collapsible={collapsible}
            color={isHigher ? 'success' : 'error'}
            disableFullscreen
            sx={sx}
            title={title}>
            <Typography component="div" mb={1} variant="h3">
                {number1Prefix}
                {formatNumber(number1, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                    notation: 'compact',
                })}
                {number1Suffix}
            </Typography>

            {number2 !== undefined && timeUnit && (
                <Number2Text
                    number1={number1}
                    number2={number2}
                    timeUnit={timeUnit}
                />
            )}
        </StatCard>
    )
}

function Number2Text({
    number1,
    number2,
    timeUnit,
}: {
    number1: number
    number2: number
    timeUnit: string
}) {
    const isHigher = number1 > number2
    const diffPercentage =
        number2 > 0 ? Math.abs((number1 - number2) / number2) * 100 : 0

    return (
        <Typography
            alignItems="center"
            color="grey"
            component="div"
            display="flex"
            gap={1}
            lineHeight="unset"
            variant="subtitle1">
            <Box
                alignItems="center"
                component="span"
                display="flex"
                gap={0.5}
                lineHeight="unset"
                sx={{
                    color: isHigher ? 'success.dark' : 'error.dark',
                    fontWeight: 'bold',
                }}>
                {formatNumber(diffPercentage, {
                    maximumFractionDigits: 1,
                })}
                % {isHigher ? <TrendingUp /> : <TrendingDown />}
            </Box>
            lebih {isHigher ? 'tinggi' : 'rendah'} dari {timeUnit} lalu
        </Typography>
    )
}

export interface BigNumberCardProps {
    title: ReactNode
    number1: number
    number2?: number
    timeUnit?: string
    number1Suffix?: string
    number1Prefix?: string
    collapsible?: boolean
    sx?: CardProps['sx']
}
