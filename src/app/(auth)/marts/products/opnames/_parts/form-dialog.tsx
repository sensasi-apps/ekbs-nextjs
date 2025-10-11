// vendors

// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { UUID } from 'crypto'
import { Formik } from 'formik'
import axios from '@/lib/axios'
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
// components
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
// utils
import handle422 from '@/utils/handle-422'
import Form, { type CreateFormValues } from './form'

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
        <Dialog disableRestoreFocus maxWidth="xs" open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Opname Produk'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    component={Form}
                    initialStatus={selectedRow}
                    initialValues={formValues ?? {}}
                    onReset={onClose}
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
                />
            </DialogContent>
        </Dialog>
    )
}
