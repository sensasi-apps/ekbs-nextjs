// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
// hooks
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function FormActions({
    submitting,
    deleting,
    disabled,
    onCancel,
    onDelete,
}: {
    submitting?: boolean
    deleting?: boolean
    disabled?: boolean
    onCancel: () => void
    onDelete?: () => void
}) {
    const isOnline = useOnlineStatus()

    return (
        <Box
            display="flex"
            justifyContent={onDelete ? 'space-between' : 'flex-end'}
            alignContent="end"
            mt={2}>
            {onDelete && (
                <LoadingButton
                    onClick={onDelete}
                    disabled={submitting || disabled || !isOnline}
                    loading={deleting}
                    color="error">
                    Hapus
                </LoadingButton>
            )}

            <Box display="flex" gap={1}>
                <Button
                    disabled={submitting || deleting || disabled}
                    type="reset"
                    color="info"
                    onClick={onCancel}>
                    Batal
                </Button>

                <LoadingButton
                    type="submit"
                    disabled={deleting || disabled || !isOnline}
                    loading={submitting}
                    variant={!isOnline ? 'outlined' : 'contained'}
                    color="info">
                    Simpan
                </LoadingButton>
            </Box>
        </Box>
    )
}
