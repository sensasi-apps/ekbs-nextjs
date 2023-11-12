import { memo } from 'react'
import ConfirmationDialogWithButton from '../ConfirmationDialog/WithButton'

const FormResetButton = memo(function FormResetButton({
    dirty,
    disabled,
    form,
}: {
    dirty: boolean
    disabled: boolean
    form: string
}) {
    return (
        <ConfirmationDialogWithButton
            title="Apakah Anda yakin ingin membatalkan perubahan?"
            shouldConfirm={dirty}
            onConfirm={() => {}}
            color="warning"
            buttonProps={{
                type: dirty ? 'button' : 'reset',
                disabled: disabled,
                color: 'info',
                children: dirty ? 'Batal' : 'Tutup',
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
