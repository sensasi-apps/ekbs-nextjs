// vendors

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

export default DefaultItemDesc
