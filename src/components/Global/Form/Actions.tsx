import { FC } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

const FormActions: FC<FormActionsProps> = ({
    submitting,
    deleting,
    disabled,
    onCancel,
    onDelete,
}) => (
    <Box
        display="flex"
        justifyContent={onDelete ? 'space-between' : 'flex-end'}
        alignContent="end"
        mt={2}>
        {onDelete && (
            <LoadingButton
                onClick={onDelete}
                disabled={submitting || disabled}
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
                disabled={deleting || disabled}
                loading={submitting}
                variant="contained"
                color="info">
                Simpan
            </LoadingButton>
        </Box>
    </Box>
)

export default FormActions

interface FormActionsProps {
    submitting?: boolean
    deleting?: boolean
    disabled?: boolean
    onCancel: () => void
    onDelete?: () => void
}
