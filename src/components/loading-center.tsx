import Box, { type BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function LoadingCenter(props: BoxProps) {
    return (
        <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap={2}
            height="100%"
            justifyContent="center"
            width="100%"
            {...props}>
            <CircularProgress color="success" />
            <Typography color="success" variant="body2">
                Sedang memuat...
            </Typography>
        </Box>
    )
}
