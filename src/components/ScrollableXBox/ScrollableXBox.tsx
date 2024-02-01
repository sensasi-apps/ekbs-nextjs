import { memo } from 'react'
import Box, { BoxProps } from '@mui/material/Box'

const ScrollableXBox = memo(function ScrollableXBox(props: BoxProps) {
    return (
        <Box
            display="flex"
            gap={1}
            whiteSpace="nowrap"
            sx={{
                overflowX: 'auto',
            }}
            {...props}
        />
    )
})

export default ScrollableXBox
