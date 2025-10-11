// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useIsOnline } from 'react-use-is-online'

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
            alignContent="end"
            display="flex"
            justifyContent={onDelete ? 'space-between' : 'flex-end'}
            mt={2}>
            {onDelete && (
                <Button
                    color="error"
                    disabled={submitting || disabled || isOffline}
                    loading={deleting}
                    onClick={onDelete}>
                    Hapus
                </Button>
            )}

            <Box display="flex" gap={1}>
                <Button
                    color="info"
                    disabled={submitting || deleting || disabled}
                    onClick={onCancel}
                    type="reset">
                    Batal
                </Button>

                <Button
                    color="info"
                    disabled={deleting || disabled || isOffline}
                    loading={submitting}
                    type="submit"
                    variant={isOffline ? 'outlined' : 'contained'}>
                    Simpan
                </Button>
            </Box>
        </Box>
    )
}
