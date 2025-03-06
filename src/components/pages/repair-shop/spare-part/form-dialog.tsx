// vendors
import { Formik, type FormikProps } from 'formik'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
// components
import type SparePart from '@/@types/Data/repair-shop/spare-part'
import FormikForm, {
    NumericField,
    Radio,
    TextField,
} from '@/components/FormikForm'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/errorCatcher'

type FormData = Partial<SparePart>

export default function SparePartFormDialog({
    formData,
    handleClose,
    onSuccess,
}: {
    formData: FormData | undefined
    handleClose: () => void
    onSuccess: () => void
}) {
    const isNew = !formData?.id

    return (
        <Dialog open={Boolean(formData)} maxWidth="xs">
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Suku Cadang
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                }}>
                <Formik<FormData>
                    initialValues={formData ?? {}}
                    onSubmit={(values, { setErrors }) => {
                        const request = isNew ? myAxios.post : myAxios.put

                        return request(
                            `repair-shop/spare-part/` + (formData?.id ?? ''),
                            values,
                        )
                            .then(onSuccess)
                            .catch(error => handle422(error, setErrors))
                    }}
                    onReset={handleClose}
                    component={SparePartFormikForm}
                />
            </DialogContent>
        </Dialog>
    )
}

function SparePartFormikForm({
    dirty,
    isSubmitting,
    values,
}: FormikProps<FormData>) {
    return (
        <FormikForm
            id="product-purchase-form"
            autoComplete="off"
            isNew={!values.id}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting,
                },
            }}>
            <TextField
                name="code"
                label="Kode"
                disabled={isSubmitting}
                textFieldProps={{
                    required: false,
                }}
            />

            <TextField name="name" label="Name" disabled={isSubmitting} />

            <TextField name="unit" label="Satuan" disabled={isSubmitting} />

            <NumericField
                name="low_number"
                label="Jumlah Minimal"
                disabled={isSubmitting}
                numericFormatProps={{
                    required: false,
                    slotProps: {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {values.unit}
                                </InputAdornment>
                            ),
                        },
                    },
                }}
            />

            <NumericField
                name="margin_percent"
                label="Margin"
                disabled={isSubmitting}
                numericFormatProps={{
                    required: false,
                    slotProps: {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    %
                                </InputAdornment>
                            ),
                        },
                    },
                }}
            />

            <TextField
                name="note"
                label="Catatan"
                textFieldProps={{
                    required: false,
                    multiline: true,
                }}
                disabled={isSubmitting}
            />

            <Radio
                disabled={isSubmitting}
                name="vehicle_type"
                label="Jenis"
                options={[
                    {
                        label: 'Motor',
                        value: 'motorcycle',
                    },
                    {
                        label: 'Mobil',
                        value: 'car',
                    },
                ]}
            />
        </FormikForm>
    )
}
