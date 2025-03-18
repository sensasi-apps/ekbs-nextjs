// vendors
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
// materials
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
// components
import FormikForm, { NumericField, TextField } from '@/components/FormikForm'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'
// feature scope
import type Service from '../types/service'

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
        <Dialog open={Boolean(formData)} maxWidth="xs">
            <DialogTitle>{isNew ? 'Tambah' : 'Ubah'} Data Layanan</DialogTitle>
            <DialogContent>
                <Formik<FormData>
                    initialValues={formData ?? {}}
                    onSubmit={(values, { setErrors, resetForm }) => {
                        const request = isNew ? myAxios.post : myAxios.put

                        return request(
                            `repair-shop/services/` + (formData?.id ?? ''),
                            values,
                        )
                            .then(resetForm)
                            .catch(error => handle422(error, setErrors))
                    }}
                    onReset={handleClose}
                    component={ServiceFormikForm}
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
            id="service-form"
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

            <TextField name="name" label="Nama" disabled={isSubmitting} />

            <NumericField
                name="default_price"
                label="Harga default"
                disabled={isSubmitting}
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
