// vendors
import { ReactNode, memo, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const Card = memo(function Card({
    children,
    title,
    isLoading,
    collapsible = false,
}: {
    children: ReactNode
    title: string
    isLoading?: boolean
    collapsible?: boolean
}) {
    const [isCollapse, setIsCollapse] = useState(collapsible)

    return (
        <MuiCard>
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
