import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import StatCard, { type StatCardProps } from './stat-card'

export default function StatCardBigNumber({
    primary,
    secondary,
    ...props
}: Omit<StatCardProps, 'children'> & {
    children?: never
    primary: number | string | ReactNode
    secondary?: number | string | ReactNode
}) {
    return (
        <StatCard {...props}>
            <Typography component="div" variant="h2" whiteSpace="nowrap">
                {primary}
            </Typography>

            {secondary && (
                <Typography
                    color="GrayText"
                    component="div"
                    variant="subtitle2">
                    {secondary}
                </Typography>
            )}
        </StatCard>
    )
}
