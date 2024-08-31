import type { UUID } from 'crypto'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import Form, { CreateFormValues } from './Form'
import ProductMovement from '@/dataTypes/mart/ProductMovement'
import handle422 from '@/utils/errorCatcher'
import axios from '@/lib/axios'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'

export default function FormDialog({
    formValues,
    selectedRow,
    onSubmitted,
    handleClose,
}: {
    formValues?: CreateFormValues
    selectedRow?: ProductMovement
    onSubmitted: (uuid: UUID) => void
    handleClose: () => void
}) {
    return (
        <Dialog maxWidth="xs" disableRestoreFocus open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Produk Opname'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={formValues ?? {}}
                    initialStatus={selectedRow}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post<UUID>(OpnameApiUrl.CREATE, values)
                            .then(res => onSubmitted(res.data))
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={Form}
                />
            </DialogContent>
        </Dialog>
    )
}
