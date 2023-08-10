import useUserWithDetails from '@/providers/UserWithDetails'
import { Box, Button, Typography } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'

import moment from 'moment'
import useFormData from '@/providers/FormData'

const Row = ({ title, children, helperText, ...props }) => (
    <Box {...props} mb={1}>
        <Typography variant="caption" color="text.secondary">
            {title}
        </Typography>
        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && children}

        {helperText && <Typography variant="body2">{helperText}</Typography>}
    </Box>
)

const EmployeeBox = () => {
    const { data: userWithDetails = {} } = useUserWithDetails()
    const { handleEdit } = useFormData()

    const { employee } = userWithDetails

    const {
        joined_at,
        unjoined_at,
        unjoined_reason,
        note,
        employee_status,
        position,
    } = employee || {}

    const getStatus = () => {
        if (unjoined_at) return 'Berhenti / Keluar'
        if (!joined_at) return '-'

        return 'Aktif'
    }

    const handleEditClick = () => handleEdit(employee || {})

    return (
        <div>
            <Row title="Status">
                <Typography
                    variant="h5"
                    color={unjoined_at ? 'error.light' : 'success.light'}
                    component="div">
                    {getStatus()}
                </Typography>
                <Typography>{employee_status?.name}</Typography>
            </Row>

            <Row title="Jabatan">{position || '-'}</Row>

            <Row title="Tanggal Bergabung">
                {joined_at ? moment(joined_at).format('DD MMMM YYYY') : '-'}
            </Row>

            {unjoined_at && (
                <>
                    <Row title="Tanggal Berhenti/Keluar">
                        {unjoined_at
                            ? moment(unjoined_at).format('DD MMMM YYYY')
                            : '-'}
                    </Row>

                    <Row title="Alasan Berhenti/Keluar">
                        {unjoined_reason || '-'}
                    </Row>
                </>
            )}

            <Row title="Catatan tambahan">{note || '-'}</Row>

            <Button
                size="small"
                variant="outlined"
                color="info"
                startIcon={<EditIcon />}
                onClick={handleEditClick}>
                Perbaharui data
            </Button>
        </div>
    )
}

export default EmployeeBox
