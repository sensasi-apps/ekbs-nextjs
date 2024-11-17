import type { UUID } from 'crypto'
// vendors
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// components
import Form, { type CreateFormValues } from './Form'
import ProductMovement from '@/dataTypes/mart/ProductMovement'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
// utils
import handle422 from '@/utils/errorCatcher'

export default function FormDialog({
    formValues,
    selectedRow,
    onSubmitted,
    onClose,
}: {
    formValues?: CreateFormValues
    selectedRow?: ProductMovement
    onSubmitted: (uuid: UUID) => void
    onClose: () => void
}) {
    return (
        <Dialog maxWidth="xs" disableRestoreFocus open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Opname Produk'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={formValues ?? {}}
                    initialStatus={selectedRow}
                    onSubmit={(values, { setErrors }) =>
                        (selectedRow?.uuid
                            ? axios.put(
                                  OpnameApiUrl.UPDATE_OR_GET_DETAIL.replace(
                                      '$',
                                      selectedRow.uuid,
                                  ),
                                  {
                                      note: values.note,
                                  },
                              )
                            : axios.post<UUID>(OpnameApiUrl.CREATE, values)
                        )
                            .then(res => onSubmitted(res.data))
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={onClose}
                    component={Form}
                />
            </DialogContent>
        </Dialog>
    )
}
