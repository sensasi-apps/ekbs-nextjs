import { memo } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

const GroupTitle = memo(function GroupTitle({
    children,
}: {
    children: string
}) {
    return (
        <>
            <Divider
                style={{
                    marginTop: '1rem',
                }}
            />
            <Typography
                ml={2}
                mt={2}
                variant="overline"
                color="grey"
                fontWeight="bold"
                component="div">
                {children}
            </Typography>
        </>
    )
})

export default GroupTitle
