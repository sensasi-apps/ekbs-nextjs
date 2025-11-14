// vendors

// materials
import type { ButtonProps } from '@mui/material/Button'
// components
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'

function FormResetButton({
    dirty,
    disabled,
    form,
    slotProps,
}: {
    dirty: boolean
    disabled: boolean
    form: string
    slotProps?: {
        button?: Omit<ButtonProps, 'type' | 'form' | 'disabled'>
    }
}) {
    const {
        color = 'success',
        children = dirty ? 'Batal' : 'Tutup',
        ...buttonProps
    } = slotProps?.button ?? {}

    return (
        <ConfirmationDialogWithButton
            buttonProps={{
                children: children,
                color: color,
                disabled: disabled,
                form: form,
                type: dirty ? 'button' : 'reset',
                ...buttonProps,
            }}
            color="warning"
            confirmButtonProps={{
                form: form,
                type: 'reset',
            }}
            onConfirm={() => {}}
            shouldConfirm={dirty}
            title="Apakah Anda yakin ingin membatalkan perubahan?">
            Perubahan yang belum disimpan akan hilang.
        </ConfirmationDialogWithButton>
    )
}

export default FormResetButton
