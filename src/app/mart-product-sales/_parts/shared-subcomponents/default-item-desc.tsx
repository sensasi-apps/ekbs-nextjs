// vendors

// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

function DefaultItemDesc({
    desc,
    value,
}: {
    desc: string
    value: number | string
}) {
    return (
        <Box display="flex" gap={1}>
            <Typography
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}
                variant="caption">
                {desc}
            </Typography>

            <Typography component="div" fontWeight="bold" variant="caption">
                {value}
            </Typography>
        </Box>
    )
}

export default memo(DefaultItemDesc)
