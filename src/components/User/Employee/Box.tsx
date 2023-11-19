// types
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'
// utils
import toDmy from '@/utils/toDmy'

export default function EmployeeBox() {
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
                {joined_at ? toDmy(joined_at) : '-'}
            </Row>

            {unjoined_at && (
                <>
                    <Row title="Tanggal Berhenti/Keluar">
                        {unjoined_at ? toDmy(joined_at) : '-'}
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

const Row = ({
    title,
    children,
    helperText,
    ...props
}: {
    title: string
    children: React.ReactNode
    helperText?: string
} & BoxProps) => (
    <Box {...props} mb={1}>
        <Typography variant="caption" color="text.secondary">
            {title}
        </Typography>
        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && children}

        {helperText && <Typography variant="body2">{helperText}</Typography>}
    </Box>
)
