// vendors
import type { UUID } from 'crypto'
import { Formik, type FormikProps } from 'formik'
import axios from '@/lib/axios'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// utils
import handle422 from '@/utils/handle-422'
// formik
import DateField from '@/components/formik-fields/date-field'
import FormikForm from '@/components/formik-form-v2'
import TextField from '@/components/formik-fields/text-field'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'

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
        <Dialog maxWidth="xs" disableRestoreFocus open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Opname Suku Cadang'}
            </DialogTitle>

            <DialogContent>
                <Formik
                    initialValues={formValues ?? {}}
                    initialStatus={selectedRow}
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
                    onReset={onClose}
                    component={Form}
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
                name="at"
                label="Tanggal"
                disabled
                datePickerProps={{
                    format: 'YYYY-MM-DD HH:mm',
                }}
            />

            <TextField
                name="note"
                label="Catatan"
                textFieldProps={{
                    required: false,
                    multiline: true,
                    minRows: 2,
                }}
            />
        </FormikForm>
    )
}

export type CreateFormValues = Partial<{
    at: SparePartMovementORM['at']
    note: SparePartMovementORM['note']
}>
