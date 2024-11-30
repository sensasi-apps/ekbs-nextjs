// vendors
import { useState } from 'react'
// materials
import MuiCard, { type CardProps } from '@mui/material/Card'
import LinearProgress, {
    LinearProgressProps,
} from '@mui/material/LinearProgress'
import {
    Box,
    CardActionArea,
    CardContent,
    Collapse,
    Dialog,
    DialogContent,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material'
// icons
import { Close, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
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
                    <Typography textTransform="capitalize" variant="body1">
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
