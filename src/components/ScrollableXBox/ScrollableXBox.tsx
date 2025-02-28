import { memo } from 'react'
import Box, { type BoxProps } from '@mui/material/Box'

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
            display="flex"
            gap={1}
            whiteSpace="nowrap"
            alignItems="center"
            sx={appliedSx}
            {...props}
        />
    )
})

export default ScrollableXBox
