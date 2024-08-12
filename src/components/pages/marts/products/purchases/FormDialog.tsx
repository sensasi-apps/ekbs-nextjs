import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import Form, { FormValues } from './Form'
import ProductMovement from '@/dataTypes/mart/ProductMovement'
import getAxiosRequest from './getAxiosRequest'
import handle422 from '@/utils/errorCatcher'

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
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={Form}
                />
            </DialogContent>
        </Dialog>
    )
}
