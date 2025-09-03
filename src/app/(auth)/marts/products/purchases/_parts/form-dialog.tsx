// vendors
import type { AxiosError } from 'axios'
import { Formik } from 'formik'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
//
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import Form, { type FormValues } from './form'
import getAxiosRequest from './get-axios-request'
import { transformToFormikErrors } from '@/utils/transform-to-formik-errors'

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
        <Dialog fullScreen disableRestoreFocus open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Pembelian Produk'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={formValues ?? {}}
                    initialStatus={selectedRow}
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
                    onReset={handleClose}
                    component={Form}
                />
            </DialogContent>
        </Dialog>
    )
}
