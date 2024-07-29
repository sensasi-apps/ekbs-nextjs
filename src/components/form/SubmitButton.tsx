import { memo } from 'react'
import ConfirmationDialogWithButton from '../ConfirmationDialog/WithButton'

const FormSubmitButton = memo(function FormSubmitButton({
    oldDirty,
    loading,
    disabled,
    form,
    confirmationText,
}: {
    disabled: boolean
    loading: boolean
    oldDirty: boolean
    form: string
    confirmationText?: string
}) {
    return (
        <ConfirmationDialogWithButton
            title="Konfirmasi Perubahan"
            shouldConfirm={oldDirty}
            onConfirm={() => {}}
            color="info"
            buttonProps={{
                type: oldDirty ? 'button' : 'submit',
                form: form,
                variant: 'contained',
                loading: loading,
                disabled: disabled,
                children: 'Simpan',
            }}
            confirmButtonProps={{
                type: 'submit',
                form: form,
            }}>
            {confirmationText ?? 'Apakah Anda yakin ingin menyimpan perubahan?'}
        </ConfirmationDialogWithButton>
    )
})
export default FormSubmitButton
