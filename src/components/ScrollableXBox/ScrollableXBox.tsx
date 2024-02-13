import { memo } from 'react'
import Box, { BoxProps } from '@mui/material/Box'

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
            sx={appliedSx}
            {...props}
        />
    )
})

export default ScrollableXBox
