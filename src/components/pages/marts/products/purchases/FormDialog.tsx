import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import Form, { FormValues } from './Form'
import ProductMovement from '@/dataTypes/mart/ProductMovement'
import getAxiosRequest from './getAxiosRequest'
import { AxiosError } from 'axios'
import LaravelValidationException from '@/types/LaravelValidationException'
import { transformToFormikErrors } from '@/functions/transform-to-formik-errors'

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
