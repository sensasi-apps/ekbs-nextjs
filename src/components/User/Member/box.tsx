import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import toDmy from '@/utils/to-dmy'

function Row({
    title,
    children,
    helperText,
}: {
    title: string
    children: ReactNode
    helperText?: string
}) {
    return (
        <Box mb={1}>
            <Typography color="text.secondary" variant="caption">
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

export default function MemberBox() {
    const { data: userWithDetails } = useUserDetailSwr()
    const { member } = userWithDetails ?? {}
    const { joined_at, unjoined_at, unjoined_reason, note } = member ?? {}

    const getStatus = () => {
        if (unjoined_at) return 'Berhenti / Keluar'

        return 'Aktif'
    }

    return (
        <Box>
            <Row title="Status">
                <Typography
                    color={unjoined_at ? 'error.light' : 'success.light'}
                    component="div"
                    variant="h5">
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
                        {unjoined_reason ?? '-'}
                    </Row>
                </>
            )}

            <Row title="Catatan tambahan">{note ?? '-'}</Row>
        </Box>
    )
}
