import Box, { type BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function LoadingCenter(props: BoxProps) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            {...props}>
            <CircularProgress />
            <Typography variant="body2" color="primary">
                Sedang memuat...
            </Typography>
        </Box>
    )
}
