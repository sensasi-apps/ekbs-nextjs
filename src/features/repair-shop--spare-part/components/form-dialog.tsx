// vendors
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
// components
import FormikForm, {
    NumericField,
    Radio,
    TextField,
} from '@/components/FormikForm'
//
import myAxios from '@/lib/axios'
// utils
import handle422 from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'

export type FormData = Partial<{
    id: number
    code: string
    name: string
    unit: string

    /**
     * margin percent should be per warehouse not per spare part but it's ok for now
     */
    margin_percent: number

    /**
     * margin percent should be per warehouse not per spare part but it's ok for now
     */
    margin_percent_installment: number
    vehicle_type: 'motorcycle' | 'car'
    deleted_at: string
}>

export default function SparePartFormDialog({
    formData,
    handleClose,
}: {
    formData: FormData | undefined
    handleClose: () => void
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
                    onSubmit={(values, { setErrors, resetForm }) => {
                        const request = isNew ? myAxios.post : myAxios.put

                        return request(
                            `repair-shop/spare-parts` +
                                (formData?.id ? '/' + formData.id : ''),
                            values,
                        )
                            .then(resetForm)
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
    handleReset,
    isSubmitting,
    setErrors,
    values,
}: FormikProps<FormData>) {
    const [isDeleting, setIsDeleting] = useState(false)

    function handleDelete() {
        setIsDeleting(true)

        myAxios
            .delete(`repair-shop/spare-parts/${values.id}`)
            .then(() => handleReset())
            .catch(error => handle422(error, setErrors))
            .finally(() => setIsDeleting(false))
    }

    return (
        <FormikForm
            id="product-purchase-form"
            autoComplete="off"
            isNew={!values.id}
            dirty={dirty || Boolean(values.deleted_at)}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting,
                },
                deleteButton:
                    values.id && !values.deleted_at
                        ? {
                              onClick: handleDelete,
                              loading: isDeleting,
                              disabled: isSubmitting,
                          }
                        : undefined,
            }}>
            {values?.deleted_at && (
                <Alert severity="warning">
                    Data telah dihapus pada <b>{toDmy(values.deleted_at)}.</b>{' '}
                    Silakan klik <b>SIMPAN</b> untuk mengembalikan data ini.
                </Alert>
            )}
            <TextField
                name="code"
                label="Kode"
                disabled={isSubmitting}
                textFieldProps={{
                    required: false,
                    helperText: values?.code
                        ? undefined
                        : 'Lewati isian untuk kode otomatis',
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

            <Box display="flex" gap={1.5}>
                <NumericField
                    name="margin_percent"
                    label="Marjin Default"
                    disabled={isSubmitting}
                    numericFormatProps={{
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

                <NumericField
                    name="installment_margin_percent"
                    label="Marjin Default Angsuran"
                    disabled={isSubmitting}
                    numericFormatProps={{
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
            </Box>

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
