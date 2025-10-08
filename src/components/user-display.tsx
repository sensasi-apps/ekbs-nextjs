import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import type UserORM from '@/modules/user/types/orms/user'

export default function UserDisplay({
    data: { id, name },
}: {
    data: {
        id: UserORM['id']
        name: UserORM['name']
    }
}) {
    return (
        <Box display="flex" gap={1} component="span" alignItems="center">
            <Chip
                label={id}
                variant="outlined"
                color="info"
                size="small"
                sx={{
                    fontSize: '0.7em',
                    lineHeight: '1em',
                }}
            />
            {name}
        </Box>
    )
}
