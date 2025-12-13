import ConfirmationDialogWithButton from '../confirmation-dialog-with-button'

function FormSubmitButton({
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
            buttonProps={{
                disabled: disabled,
                form: form,
                loading: loading,
                type: oldDirty ? 'button' : 'submit',
                variant: 'contained',
            }}
            buttonText="Simpan"
            color="success"
            confirmButtonProps={{
                form: form,
                type: 'submit',
            }}
            onConfirm={() => {}}
            shouldConfirm={oldDirty}
            title="Konfirmasi Perubahan">
            {confirmationText ?? 'Apakah Anda yakin ingin menyimpan perubahan?'}
        </ConfirmationDialogWithButton>
    )
}

export default FormSubmitButton
