'use client'

// icons-materials
import Close from '@mui/icons-material/Close'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
// materials
import Box from '@mui/material/Box'
import MuiCard, { type CardProps } from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import LinearProgress, {
    type LinearProgressProps,
} from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// vendors
import { type ReactNode, useState } from 'react'
// components
import FlexColumnBox from '@/components/flex-column-box'

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
                    color={color}
                    value={100}
                    variant="determinate"
                />

                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    px={2.5}
                    py={2}>
                    <Typography
                        component="div"
                        textTransform="capitalize"
                        variant="body1">
                        {title}
                    </Typography>

                    {collapsible && (
                        <IconButton
                            disabled={!collapsible}
                            onClick={() => setIsCollapse(prev => !prev)}
                            size="small">
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
                                overflowX: 'auto',
                                pt: 0,
                                px: 2.5,
                            }}>
                            {isLoading ? <Skeletons /> : children}
                        </CardContent>
                    </CardActionArea>
                </Collapse>
            </MuiCard>

            <Dialog
                fullScreen
                onClose={() => setIsFullscreen(false)}
                open={isFullscreen}>
                <LinearProgress
                    color={color}
                    value={100}
                    variant="determinate"
                />

                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    px={2.5}
                    py={1.5}>
                    <Typography textTransform="capitalize" variant="body1">
                        {title}
                    </Typography>

                    <IconButton
                        onClick={() => setIsFullscreen(false)}
                        size="small">
                        <Close />
                    </IconButton>
                </Box>

                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    )
}

export type StatCardProps = Omit<CardProps, 'title'> & {
    title: ReactNode
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
