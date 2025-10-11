// vendors

// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { AxiosError } from 'axios'
import { Formik } from 'formik'
//
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import { transformToFormikErrors } from '@/utils/transform-to-formik-errors'
import Form, { type FormValues } from './form'
import getAxiosRequest from './get-axios-request'

export default function FormDialog({
    formValues,
    selectedRow,
    onSumbitted,
    handleClose,
}: {
    formValues?: FormValues
    selectedRow?: ProductMovement
    onSumbitted: () => void
    handleClose: () => void
}) {
    return (
        <Dialog disableRestoreFocus fullScreen open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Pembelian Produk'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    component={Form}
                    initialStatus={selectedRow}
                    initialValues={formValues ?? {}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        getAxiosRequest(
                            selectedRow?.uuid ? 'update' : 'create',
                            selectedRow?.uuid,
                            values,
                        )
                            .then(onSumbitted)
                            .catch(
                                (
                                    error: AxiosError<LaravelValidationException>,
                                ) => {
                                    if (error.response) {
                                        const { status, data } = error.response

                                        if (status === 422) {
                                            return setErrors(
                                                transformToFormikErrors<FormValues>(
                                                    data.errors,
                                                ),
                                            )
                                        }
                                    }
                                },
                            )
                    }
                />
            </DialogContent>
        </Dialog>
    )
}
