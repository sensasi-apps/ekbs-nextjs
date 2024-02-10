// vendors
import { memo, useEffect, useRef, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// components
import FlexColumnBox from '@/components/FlexColumnBox'

const StatCard = memo(function StatCard({
    children,
    title,
    isLoading,
    collapsible = false,
    ...rest
}: StatCardProps) {
    const [isCollapse, setIsCollapse] = useState(collapsible)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isLoading && contentRef.current) {
            contentRef.current.scrollLeft = contentRef.current.scrollWidth
        }
    }, [isLoading])

    return (
        <MuiCard {...rest}>
            <LinearProgress variant="determinate" value={100} color="success" />

            <CardActionArea
                disabled={!collapsible}
                onClick={() => setIsCollapse(prev => !prev)}>
                <Box
                    p={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography textTransform="capitalize" variant="body1">
                        {title}
                    </Typography>

                    {collapsible ? (
                        isCollapse ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowUpIcon />
                        )
                    ) : null}
                </Box>
            </CardActionArea>

            <Collapse in={!isCollapse} unmountOnExit>
                <CardContent
                    ref={contentRef}
                    sx={{
                        pt: 0,
                        overflowX: 'auto',
                    }}>
                    {isLoading ? <Skeletons /> : children}
                </CardContent>
            </Collapse>
        </MuiCard>
    )
})

export default StatCard

export type StatCardProps = CardProps & {
    title: string
    isLoading?: boolean
    collapsible?: boolean
}

function Skeletons() {
    return (
        <FlexColumnBox gap={1}>
            <Skeleton variant="rounded" />
            <Skeleton variant="rounded" />
            <Skeleton variant="rounded" />
        </FlexColumnBox>
    )
}
