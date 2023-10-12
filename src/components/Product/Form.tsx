import type { KeyedMutator } from 'swr'
import type ProductType from '@/dataTypes/Product'

import { FC, FormEvent } from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import useFormData from '@/providers/useFormData'
import FormActions from '../Global/Form/Actions'
import axios from '@/lib/axios'
import useValidationErrors from '@/hooks/useValidationErrors'
import { NumericFormat } from 'react-number-format'

const ProductForm: FC<{
    parentDatatableMutator: KeyedMutator<any>
}> = ({ parentDatatableMutator }) => {
    const { data, isDirty, handleClose, loading, setSubmitting } =
        useFormData<ProductType>()
    const { validationErrors, setValidationErrors } = useValidationErrors()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget
        if (formEl.checkValidity() === false) {
            event.stopPropagation()
            return formEl.reportValidity()
        }

        const formData = new FormData(formEl)
        formData.set(
            'low_number',
            (formData.get('low_number') as string).replaceAll('.', '') || '',
        )

        setSubmitting(true)

        axios
            .post(
                `/farm-inputs/products${data.id ? '/' + data.id : ''}`,
                formData,
            )
            .then(() => {
                parentDatatableMutator()
                handleClose()
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    return setValidationErrors(error.response?.data.errors)
                }

                throw error
            })
            .finally(() => setSubmitting(false))
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        disabled={loading}
                        label="Kode"
                        name="code"
                        size="small"
                        margin="dense"
                        defaultValue={data.code || ''}
                        error={Boolean(validationErrors.code)}
                        helperText={validationErrors.code}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        disabled={loading}
                        label="Nama"
                        name="name"
                        required
                        size="small"
                        margin="dense"
                        defaultValue={data.name || ''}
                        error={Boolean(validationErrors.name)}
                        helperText={validationErrors.name}
                    />
                </Grid>
            </Grid>

            <TextField
                fullWidth
                disabled={loading}
                label="Kategori"
                name="category_name"
                required
                size="small"
                margin="dense"
                defaultValue={data.category_name || ''}
                error={Boolean(validationErrors.category_name)}
                helperText={validationErrors.category_name}
            />

            <TextField
                multiline
                disabled={loading}
                rows={2}
                fullWidth
                label="Deskripsi"
                name="description"
                size="small"
                margin="dense"
                defaultValue={data.description || ''}
                error={Boolean(validationErrors.description)}
                helperText={validationErrors.description}
            />

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <NumericFormat
                        customInput={TextField}
                        fullWidth
                        disabled={loading}
                        label="Persediaan Menipis Pada"
                        name="low_number"
                        size="small"
                        margin="dense"
                        defaultValue={data.low_number || ''}
                        error={Boolean(validationErrors.low_number)}
                        helperText={validationErrors.low_number}
                        thousandSeparator="."
                        decimalSeparator=","
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        disabled={loading}
                        label="Satuan"
                        name="unit"
                        required
                        size="small"
                        margin="dense"
                        defaultValue={data.unit || 'pcs'}
                        error={Boolean(validationErrors.unit)}
                        helperText={validationErrors.unit}
                    />
                </Grid>
            </Grid>
            <TextField
                multiline
                disabled={loading}
                rows={2}
                fullWidth
                label="Catatan"
                name="note"
                size="small"
                margin="dense"
                defaultValue={data.note || ''}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
            />
            <FormActions
                disabled={loading}
                onCancel={() => {
                    if (
                        isDirty &&
                        !window.confirm(
                            'Perubahan belum tersimpan, yakin ingin menutup?',
                        )
                    ) {
                        return
                    }

                    return handleClose()
                }}
            />
        </form>
    )
}

export default ProductForm
