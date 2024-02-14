import type { ReactNode } from 'react'
import Typography from '@mui/material/Typography'
import StatCard, { StatCardProps } from './StatCard'

export default function BigNumber({
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
            <Typography variant="h2" component="div" whiteSpace="nowrap">
                {primary}
            </Typography>

            {secondary && (
                <Typography
                    variant="subtitle2"
                    component="div"
                    color="GrayText">
                    {secondary}
                </Typography>
            )}
        </StatCard>
    )
}
