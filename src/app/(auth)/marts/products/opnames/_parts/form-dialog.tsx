// vendors
import type { UUID } from 'crypto'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// components
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import Form, { type CreateFormValues } from './form'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
// utils
import handle422 from '@/utils/handle-422'

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
