import { Box, type CardProps, Typography } from '@mui/material'
import StatCard from '../StatCard'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import formatNumber from '@/utils/formatNumber'

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
    const isHigher = number1 > number2
    const diffPercentage =
        number2 > 0 ? Math.abs((number1 - number2) / number2) * 100 : 0

    return (
        <StatCard
            collapsible={collapsible}
            disableFullscreen
            title={title}
            color={isHigher ? 'success' : 'error'}
            sx={sx}>
            <Typography variant="h3" mb={1} component="div">
                {number1Prefix}
                {formatNumber(number1, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                    notation: 'compact',
                })}
                {number1Suffix}
            </Typography>

            <Typography
                variant="subtitle1"
                component="div"
                color="grey"
                display="flex"
                lineHeight="unset"
                alignItems="center"
                gap={1}>
                <Box
                    lineHeight="unset"
                    component="span"
                    sx={{
                        fontWeight: 'bold',
                        color: isHigher ? 'success.dark' : 'error.dark',
                    }}
                    display="flex"
                    alignItems="center"
                    gap={0.5}>
                    {formatNumber(diffPercentage, {
                        maximumFractionDigits: 1,
                    })}
                    % {isHigher ? <TrendingUp /> : <TrendingDown />}
                </Box>
                lebih {isHigher ? 'tinggi' : 'rendah'} dari {timeUnit} lalu
            </Typography>
        </StatCard>
    )
}

export interface BigNumberCardProps {
    title: string | JSX.Element
    number1: number
    number2: number
    timeUnit: string
    number1Suffix?: string
    number1Prefix?: string
    collapsible?: boolean
    sx?: CardProps['sx']
}
