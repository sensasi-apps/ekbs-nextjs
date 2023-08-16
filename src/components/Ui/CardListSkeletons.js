import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

const CardListSkeletons = () => (
    <Box
        sx={{
            '& > *': {
                mb: 2,
            },
        }}>
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={80} />
    </Box>
)

export default CardListSkeletons
