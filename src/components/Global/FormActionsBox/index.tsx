import { FC } from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

interface FormActionsBoxProps extends BoxProps {
    submitting?: boolean
    deleting?: boolean
    disabled?: boolean
    onCancel: () => void
    onDelete?: () => void
}

const FormActionsBox: FC<FormActionsBoxProps> = ({
    submitting,
    deleting,
    disabled,
    onCancel,
    onDelete,
    ...rest
}) => (
    <Box
        display="flex"
        justifyContent={onDelete ? 'space-between' : 'flex-end'}
        alignContent="end"
        mt={2}
        {...rest}>
        {onDelete && (
            <LoadingButton
                onClick={onDelete}
                disabled={submitting || disabled}
                loading={deleting}
                color="error">
                Hapus
            </LoadingButton>
        )}

        <div>
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
        </div>
    </Box>
)

export default FormActionsBox
