// vendors

// materials
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
// utils
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
import toDmy from '@/utils/to-dmy'
// feature scope
import type Service from '../../../../../../modules/repair-shop/types/orms/service'

type FormData = Partial<Service>

export default function ServiceFormDialog({
    formData,
    handleClose,
}: {
    formData: FormData | undefined
    handleClose: () => void
}) {
    const isNew = !formData?.id

    return (
        <Dialog maxWidth="xs" open={Boolean(formData)}>
            <DialogTitle>{isNew ? 'Tambah' : 'Ubah'} Data Layanan</DialogTitle>
            <DialogContent>
                <Formik<FormData>
                    component={ServiceFormikForm}
                    initialValues={formData ?? {}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors, resetForm }) => {
                        const request = isNew ? myAxios.post : myAxios.put

                        return request(
                            `repair-shop/services` +
                                (formData?.id ? `/${formData?.id}` : ''),
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

function ServiceFormikForm({
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
            .delete(`repair-shop/services/${values.id}`)
            .then(() => handleReset())
            .catch(error => handle422(error, setErrors))
            .finally(() => setIsDeleting(false))
    }

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty || Boolean(values.deleted_at)}
            id="service-form"
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

            <TextField disabled={isSubmitting} label="Nama" name="name" />

            <NumericField
                disabled={isSubmitting}
                label="Harga default"
                name="default_price"
                numericFormatProps={{
                    slotProps: {
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    Rp
                                </InputAdornment>
                            ),
                        },
                    },
                }}
            />
        </FormikForm>
    )
}
