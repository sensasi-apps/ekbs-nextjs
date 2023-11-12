import { memo } from 'react'
import ConfirmationDialogWithButton from '../ConfirmationDialog/WithButton'

const FormSubmitButton = memo(function FormSubmitButton({
    oldDirty,
    loading,
    disabled,
    form,
}: {
    disabled: boolean
    loading: boolean
    oldDirty: boolean
    form: string
}) {
    return (
        <ConfirmationDialogWithButton
            title="Konfirmasi Perubahan"
            shouldConfirm={oldDirty}
            onConfirm={() => {}}
            color="info"
            buttonProps={{
                type: oldDirty ? 'button' : 'submit',
                variant: 'contained',
                loading: loading,
                disabled: disabled,
                children: 'Simpan',
            }}
            confirmButtonProps={{
                type: 'submit',
                form: form,
            }}>
            Apakah Anda yakin ingin menyimpan perubahan?
        </ConfirmationDialogWithButton>
    )
})
export default FormSubmitButton
