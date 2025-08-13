import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useUserWithDetails from '@/providers/UserWithDetails'
import toDmy from '@/utils/to-dmy'

const Row = ({ title, children, helperText, ...props }) => {
    return (
        <Box {...props} mb={1}>
            <Typography variant="caption" color="text.secondary">
                {title}
            </Typography>
            {typeof children === 'string' && (
                <Typography>{children}</Typography>
            )}

            {typeof children !== 'string' && children}

            {helperText && (
                <Typography variant="body2">{helperText}</Typography>
            )}
        </Box>
    )
}

const MemberBox = () => {
    const { data: userWithDetails = {} } = useUserWithDetails()
    const { member } = userWithDetails
    const { joined_at, unjoined_at, unjoined_reason, note } = member || {}

    const getStatus = () => {
        if (unjoined_at) return 'Berhenti / Keluar'

        return 'Aktif'
    }

    return (
        <Box>
            <Row title="Status">
                <Typography
                    variant="h5"
                    color={unjoined_at ? 'error.light' : 'success.light'}
                    component="div">
                    {getStatus()}
                </Typography>
            </Row>

            <Row title="Tanggal Bergabung">
                {joined_at ? toDmy(joined_at) : '-'}
            </Row>

            {unjoined_at && (
                <>
                    <Row title="Tanggal Berhenti/Keluar">
                        {unjoined_at ? toDmy(unjoined_at) : '-'}
                    </Row>

                    <Row title="Alasan Berhenti/Keluar">
                        {unjoined_reason || '-'}
                    </Row>
                </>
            )}

            <Row title="Catatan tambahan">{note || '-'}</Row>
        </Box>
    )
}

export default MemberBox
