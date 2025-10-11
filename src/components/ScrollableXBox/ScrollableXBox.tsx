import Box, { type BoxProps } from '@mui/material/Box'
import { memo } from 'react'

/**
 * Box with default scrollable x params
 *
 * @param display flex
 * @param gap 1
 * @param whiteSpace nowrap
 * @param overflowX auto
 * @param alignItems center
 */
const ScrollableXBox = memo(function ScrollableXBox({
    sx,
    ...props
}: BoxProps) {
    const appliedSx: BoxProps['sx'] = {
        overflowX: 'auto',
        ...sx,
    }

    return (
        <Box
            alignItems="center"
            display="flex"
            gap={1}
            sx={appliedSx}
            whiteSpace="nowrap"
            {...props}
        />
    )
})

export default ScrollableXBox
