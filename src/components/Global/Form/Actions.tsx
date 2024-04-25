// vendors
import { useIsOnline } from 'react-use-is-online'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
// hooks

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
    const { isOffline } = useIsOnline()

    return (
        <Box
            display="flex"
            justifyContent={onDelete ? 'space-between' : 'flex-end'}
            alignContent="end"
            mt={2}>
            {onDelete && (
                <LoadingButton
                    onClick={onDelete}
                    disabled={submitting || disabled || isOffline}
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
                    disabled={deleting || disabled || isOffline}
                    loading={submitting}
                    variant={isOffline ? 'outlined' : 'contained'}
                    color="info">
                    Simpan
                </LoadingButton>
            </Box>
        </Box>
    )
}
