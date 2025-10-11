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
        <Box alignItems="center" component="span" display="flex" gap={1}>
            <Chip
                color="info"
                label={id}
                size="small"
                sx={{
                    fontSize: '0.7em',
                    lineHeight: '1em',
                }}
                variant="outlined"
            />
            {name}
        </Box>
    )
}
