// types

import EditIcon from '@mui/icons-material/Edit'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type User from '@/modules/user/types/orms/user'
// utils
import toDmy from '@/utils/to-dmy'

export default function EmployeeDetailBox({
    data: employee,
    onClickEdit,
}: {
    data: User['employee']
    onClickEdit: () => void
}) {
    const {
        joined_at,
        unjoined_at,
        unjoined_reason,
        note,
        employee_status,
        position,
        business_unit,
    } = employee ?? {}

    function getStatus() {
        if (unjoined_at) return 'Berhenti / Keluar'
        if (!joined_at) return '-'

        return 'Aktif'
    }

    return (
        <div>
            <Row title="Status">
                <Typography
                    color={unjoined_at ? 'error.light' : 'success.light'}
                    component="div"
                    variant="h5">
                    {getStatus()}
                </Typography>

                <Typography>{employee_status?.name}</Typography>
            </Row>

            <Row title="Jabatan">{position ?? '-'}</Row>

            <Row title="Unit Usaha">{business_unit?.name ?? '-'}</Row>

            <Row title="Tanggal Bergabung">
                {joined_at ? toDmy(joined_at) : '-'}
            </Row>

            {unjoined_at && (
                <>
                    <Row title="Tanggal Berhenti/Keluar">
                        {toDmy(unjoined_at)}
                    </Row>

                    <Row title="Alasan Berhenti/Keluar">
                        {unjoined_reason ?? '-'}
                    </Row>
                </>
            )}

            <Row title="Catatan tambahan">{note ?? '-'}</Row>

            <Button
                color="info"
                onClick={onClickEdit}
                size="small"
                startIcon={<EditIcon />}
                variant="outlined">
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
        <Typography color="text.secondary" variant="caption">
            {title}
        </Typography>
        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && children}

        {helperText && <Typography variant="body2">{helperText}</Typography>}
    </Box>
)
