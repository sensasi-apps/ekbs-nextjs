import { Box, Typography } from '@mui/material'
import { memo } from 'react'

function DefaultItemDesc({
    desc,
    value,
}: {
    desc: string
    value: string | undefined
}) {
    return (
        <Box display="flex" gap={0.75}>
            <Typography
                variant="caption"
                color="GrayText"
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>
            <Typography variant="caption" component="div">
                {value ?? ''}
            </Typography>
        </Box>
    )
}

export default memo(DefaultItemDesc)
