// vendors
import { memo } from 'react'
// materials
import Box, { type BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function DefaultItemDesc({
    boxProps,
    desc,
    value,
}: {
    boxProps?: BoxProps
    desc: string
    value: number | string
}) {
    return (
        <Box display="flex" gap={1} {...boxProps}>
            <Typography
                variant="caption"
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>

            <Typography variant="caption" component="div" fontWeight="bold">
                {value}
            </Typography>
        </Box>
    )
}

export default memo(DefaultItemDesc)
