// materials
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
// vendors
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
// components
import FlexBox from '@/components/flex-box'
import NumericField from '@/components/formik-fields/numeric-field'
import Radio from '@/components/formik-fields/radio'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form'
import RpInputAdornment from '@/components/input-adornments/rp'
//
import myAxios from '@/lib/axios'
import additionalPercentToFloat from '@/utils/additional-percent-to-float'
// utils
import handle422 from '@/utils/handle-422'
import toDmy from '@/utils/to-dmy'

export type FormData = {
    /**
     * only for helper, not accepted by backend
     */
    _base_rp_per_unit: number
    _default_sell_rp: number
    _default_installment_rp: number
} & Partial<{
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
    if (!formData) {
        return null
    }

    const isNew = !formData?.id

    return (
        <Dialog maxWidth="xs" open>
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Suku Cadang
            </DialogTitle>
            <DialogContent>
                <Formik<FormData>
                    component={SparePartFormikForm}
                    initialValues={formData}
                    onReset={handleClose}
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
    setFieldValue,
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
                label="Kategori"
                name="category"
                textFieldProps={{
                    required: false,
                }}
            />

            <TextField
                label="Kode"
                name="code"
                textFieldProps={{
                    helperText: values?.code
                        ? undefined
                        : 'Lewati isian untuk kode otomatis',
                    required: false,
                }}
            />

            <TextField label="Name" name="name" />

            <TextField label="Satuan" name="unit" />

            <NumericField
                label="Jumlah Minimal"
                name="low_number"
                numericFormatProps={{
                    helperText: 'Untuk peringatan stok menipis',
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

            <FlexBox gap={1.5}>
                <NumericField
                    label="Marjin Default"
                    name="margin_percent"
                    numericFormatProps={{
                        allowNegative: true,
                        decimalScale: 4,
                        onBlur: () => {
                            setFieldValue(
                                '_default_sell_rp',
                                additionalPercentToFloat(
                                    values.margin_percent ?? 0,
                                ) * (values._base_rp_per_unit ?? 0),
                            )
                        },
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
                                        % / termin
                                    </InputAdornment>
                                ),
                                startAdornment: (
                                    <InputAdornment position="start">
                                        +
                                    </InputAdornment>
                                ),
                            },
                        },
                    }}
                />
            </FlexBox>

            <FlexBox gap={1.5}>
                <NumericField
                    label="Harga Jual Default"
                    name="_default_sell_rp"
                    numericFormatProps={{
                        decimalScale: 4,
                        min: values._base_rp_per_unit,
                        onBlur: () => {
                            setFieldValue(
                                'margin_percent',
                                (values._default_sell_rp /
                                    (values._base_rp_per_unit ?? 0)) *
                                    100 -
                                    100,
                            )
                        },
                        slotProps: {
                            input: {
                                startAdornment: <RpInputAdornment />,
                            },
                        },
                    }}
                />
            </FlexBox>

            <TextField
                label="Catatan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                }}
            />

            <Radio
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
