// vendors

// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
import NumericField from '@/components/formik-fields/numeric-field'
import Radio from '@/components/formik-fields/radio'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
//
import myAxios from '@/lib/axios'
// utils
import handle422 from '@/utils/handle-422'
import toDmy from '@/utils/to-dmy'

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
    installment_margin_percent: number
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
        <Dialog maxWidth="xs" open={Boolean(formData)}>
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Suku Cadang
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                }}>
                <Formik<FormData>
                    component={SparePartFormikForm}
                    initialValues={formData ?? {}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors, resetForm }) => {
                        const request = isNew ? myAxios.post : myAxios.put

                        return request(
                            `repair-shop/spare-parts` +
                                (formData?.id ? `/${formData.id}` : ''),
                            values,
                        )
                            .then(resetForm)
                            .catch(error => handle422(error, setErrors))
                    }}
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
            autoComplete="off"
            dirty={dirty || Boolean(values.deleted_at)}
            id="product-purchase-form"
            isNew={!values.id}
            processing={isSubmitting}
            slotProps={{
                deleteButton:
                    values.id && !values.deleted_at
                        ? {
                              disabled: isSubmitting,
                              loading: isDeleting,
                              onClick: handleDelete,
                          }
                        : undefined,
                submitButton: {
                    disabled: isSubmitting,
                },
            }}
            submitting={isSubmitting}>
            {values?.deleted_at && (
                <Alert severity="warning">
                    Data telah dihapus pada <b>{toDmy(values.deleted_at)}.</b>{' '}
                    Silakan klik <b>SIMPAN</b> untuk mengembalikan data ini.
                </Alert>
            )}
            <TextField
                disabled={isSubmitting}
                label="Kode"
                name="code"
                textFieldProps={{
                    helperText: values?.code
                        ? undefined
                        : 'Lewati isian untuk kode otomatis',
                    required: false,
                }}
            />

            <TextField disabled={isSubmitting} label="Name" name="name" />

            <TextField disabled={isSubmitting} label="Satuan" name="unit" />

            <NumericField
                disabled={isSubmitting}
                label="Jumlah Minimal"
                name="low_number"
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
                    disabled={isSubmitting}
                    label="Marjin Default"
                    name="margin_percent"
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
                    label="Marjin Default Angsuran"
                    name="installment_margin_percent"
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
                disabled={isSubmitting}
                label="Catatan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                }}
            />

            <Radio
                disabled={isSubmitting}
                label="Jenis"
                name="vehicle_type"
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
