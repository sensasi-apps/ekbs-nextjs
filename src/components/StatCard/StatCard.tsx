// vendors
import { useState } from 'react'
// materials
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import MuiCard, { type CardProps } from '@mui/material/Card'
import LinearProgress, {
    type LinearProgressProps,
} from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import Close from '@mui/icons-material/Close'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
// components
import FlexColumnBox from '@/components/FlexColumnBox'

/**
 * A component that displays a card with a title, optional collapsible content, and a loading state.
 */
export default function StatCard({
    children,
    title,
    isLoading,
    collapsible = false,
    color = 'success',
    disableFullscreen,
    ...rest
}: StatCardProps) {
    const [isCollapse, setIsCollapse] = useState(collapsible)
    const [isFullscreen, setIsFullscreen] = useState(false)

    return (
        <>
            <MuiCard {...rest}>
                <LinearProgress
                    variant="determinate"
                    value={100}
                    color={color}
                />

                <Box
                    px={2.5}
                    py={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography
                        component="div"
                        textTransform="capitalize"
                        variant="body1">
                        {title}
                    </Typography>

                    {collapsible && (
                        <IconButton
                            size="small"
                            disabled={!collapsible}
                            onClick={() => setIsCollapse(prev => !prev)}>
                            {isCollapse ? (
                                <KeyboardArrowDown />
                            ) : (
                                <KeyboardArrowUp />
                            )}
                        </IconButton>
                    )}
                </Box>

                <Collapse in={!isCollapse} unmountOnExit>
                    <CardActionArea
                        disabled={disableFullscreen}
                        onClick={() => setIsFullscreen(true)}>
                        <CardContent
                            sx={{
                                pt: 0,
                                px: 2.5,
                                overflowX: 'auto',
                            }}>
                            {isLoading ? <Skeletons /> : children}
                        </CardContent>
                    </CardActionArea>
                </Collapse>
            </MuiCard>

            <Dialog
                fullScreen
                open={isFullscreen}
                onClose={() => setIsFullscreen(false)}>
                <LinearProgress
                    variant="determinate"
                    value={100}
                    color={color}
                />

                <Box
                    px={2.5}
                    py={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography textTransform="capitalize" variant="body1">
                        {title}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => setIsFullscreen(false)}>
                        <Close />
                    </IconButton>
                </Box>

                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    )
}

export type StatCardProps = Omit<CardProps, 'title'> & {
    title: string | JSX.Element
    isLoading?: boolean
    collapsible?: boolean
    color?: LinearProgressProps['color']
    disableFullscreen?: boolean
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
