import { Box, Chip, Typography } from '@mui/material'

const UserSimplifiedViewUserBox = ({ data: user, ...props }) => (
    <Box {...props}>
        <Typography variant="h6" component="div">
            {user.name}
            <Typography
                ml={1}
                variant="body2"
                color="GrayText"
                component="span">
                #{user.id}
            </Typography>
        </Typography>

        {user?.role_names?.includes('employee') && (
            <Chip label="Karyawan" size="small" />
        )}

        {user?.role_names?.includes('member') && (
            <Chip label="Anggota" size="small" />
        )}

        {user?.role_names?.includes('courier') && (
            <Chip label="Pengangkut" size="small" />
        )}
    </Box>
)

export default UserSimplifiedViewUserBox
