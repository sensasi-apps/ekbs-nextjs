import { ReactNode, memo } from 'react'

import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

const Card = memo(function Card({
    children,
    title,
    isLoading,
}: {
    children: ReactNode
    title: string
    isLoading?: boolean
}) {
    return (
        <MuiCard>
            <LinearProgress variant="determinate" value={100} color="success" />
            <CardContent>
                <Typography
                    textTransform="capitalize"
                    color="textSecondary"
                    mb={2}>
                    {title}
                </Typography>

                {isLoading ? <Skeletons /> : children}
            </CardContent>
        </MuiCard>
    )
})

export default Card

function Skeletons() {
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Skeleton variant="rounded" />
            <Skeleton variant="rounded" />
            <Skeleton variant="rounded" />
        </Box>
    )
}
