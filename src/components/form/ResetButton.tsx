// vendors
import { memo } from 'react'
// materials
import type { ButtonProps } from '@mui/material/Button'
// components
import ConfirmationDialogWithButton from '@/components/ConfirmationDialog/WithButton'

const FormResetButton = memo(function FormResetButton({
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
            title="Apakah Anda yakin ingin membatalkan perubahan?"
            shouldConfirm={dirty}
            onConfirm={() => {}}
            color="warning"
            buttonProps={{
                type: dirty ? 'button' : 'reset',
                form: form,
                disabled: disabled,
                children: children,
                color: color,
                ...buttonProps,
            }}
            confirmButtonProps={{
                type: 'reset',
                form: form,
            }}>
            Perubahan yang belum disimpan akan hilang.
        </ConfirmationDialogWithButton>
    )
})

export default FormResetButton
