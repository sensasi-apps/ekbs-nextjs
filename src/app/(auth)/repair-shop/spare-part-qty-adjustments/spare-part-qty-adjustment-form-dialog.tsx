// vendors

// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { UUID } from 'crypto'
import { Formik, type FormikProps } from 'formik'
// formik
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form-v2'
import axios from '@/lib/axios'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import handle422 from '@/utils/handle-422'

export default function SparePartQtyAdjustmentFormDialog({
    formValues,
    selectedRow,
    onSubmitted,
    onClose,
}: {
    formValues: CreateFormValues | undefined
    selectedRow?: SparePartMovementORM
    onSubmitted: (uuid: UUID) => void
    onClose: () => void
}) {
    return (
        <Dialog disableRestoreFocus maxWidth="xs" open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Opname Suku Cadang'}
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
                                  `/repair-shop/spare-parts/qty-adjustments/${selectedRow?.uuid}`,
                                  {
                                      note: values.note,
                                  },
                              )
                            : axios.post<UUID>(
                                  '/repair-shop/spare-parts/qty-adjustments/create',
                                  values,
                              )
                        )
                            .then(res => onSubmitted(res.data))
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

function Form({
    // isSubmitting,
    // dirty,
    // status,
}: FormikProps<CreateFormValues>) {
    return (
        <FormikForm>
            {/* {dataFromDb?.short_uuid && (
                <TextFieldDefault
                    label="Kode"
                    disabled
                    required={false}
                    value={dataFromDb.short_uuid}
                />
            )} */}

            <DateField
                datePickerProps={{
                    format: 'YYYY-MM-DD HH:mm',
                }}
                disabled
                label="Tanggal"
                name="at"
            />

            <TextField
                label="Catatan"
                name="note"
                textFieldProps={{
                    minRows: 2,
                    multiline: true,
                    required: false,
                }}
            />
        </FormikForm>
    )
}

export type CreateFormValues = Partial<{
    at: SparePartMovementORM['at']
    note: SparePartMovementORM['note']
}>
