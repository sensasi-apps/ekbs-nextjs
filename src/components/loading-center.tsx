import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function LoadingCenter() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute">
            <CircularProgress />
            <Typography variant="body2" color="primary">
                Sedang memuat...
            </Typography>
        </Box>
    )
}
