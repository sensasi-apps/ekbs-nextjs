// types
import type { Mutate } from '../Datatable/@types'
import type ProductType from '@/dataTypes/Product'
import type { FormEvent } from 'react'
// vendors
import axios from '@/lib/axios'
import { NumericFormat } from 'react-number-format'
// materials
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
// components
import ApiUrlEnum from '@/components/Product/ApiUrlEnum'
import FormActions from '@/components/Global/Form/Actions'
// providers
import useFormData from '@/providers/useFormData'
import useValidationErrors from '@/hooks/useValidationErrors'
// utils
import numericFormatDefaultProps from '@/utils/numericFormatDefaultProps'
import handle422 from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'

export default function ProductForm({
    parentDatatableMutator,
}: {
    parentDatatableMutator: Mutate<ProductType>
}) {
    const {
        data,
        isDirty,
        handleClose,
        loading,
        setSubmitting,
        deleting,
        setDeleting,
    } = useFormData<ProductType>()

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

        formData.set(
            'default_sell_price',
            (formData.get('default_sell_price') as string).replaceAll(
                '.',
                '',
            ) || '',
        )

        setSubmitting(true)

        axios
            .post(
                ApiUrlEnum.UPDATE_OR_CREATE_PRODUCT.replace(
                    '$1',
                    data.id ? '/' + data.id : '',
                ),
                formData,
            )
            .then(() => {
                parentDatatableMutator()
                handleClose()
            })
            .catch(error => handle422(error, setValidationErrors))
            .finally(() => setSubmitting(false))
    }

    const handleDelete = () => {
        setDeleting(true)

        return axios
            .delete(
                ApiUrlEnum.DELETE_PRODUCT.replace(
                    '$1',
                    data.id as unknown as string,
                ),
            )
            .then(() => {
                parentDatatableMutator()
                handleClose()
            })
            .finally(() => setDeleting(false))
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            {data.deleted_at && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 1,
                    }}>
                    Produk telah dinonaaktifkan pada tanggal{' '}
                    {toDmy(data.deleted_at)}, silahkan klik tombol
                    &quot;simpan&quot; untuk mengaktifkan kembali
                </Alert>
            )}
            <Grid container columnSpacing={1.5}>
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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

            <Grid container columnSpacing={1.5}>
                <Grid item xs={12} sm={8}>
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
                <Grid item xs={12} sm={4}>
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

            {/* #########################################
            2023-12-21 - hide this column for now
            
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
            ############################################ */}

            <Grid container columnSpacing={1.5} mt={2}>
                <Grid item xs={12} sm={6}>
                    <NumericFormat
                        {...numericFormatDefaultProps}
                        customInput={TextField}
                        disabled={true}
                        fullWidth
                        label="Biaya Dasar"
                        size="small"
                        margin="dense"
                        defaultValue={data.base_cost_rp_per_unit || ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    /{data.unit}
                                </InputAdornment>
                            ),
                            startAdornment: (
                                <InputAdornment position="start">
                                    Rp
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(validationErrors.base_cost_rp_per_unit)}
                        helperText={validationErrors.base_cost_rp_per_unit}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <NumericFormat
                        {...numericFormatDefaultProps}
                        customInput={TextField}
                        disabled={loading}
                        fullWidth
                        label="Harga Jual Dasar"
                        name="default_sell_price"
                        size="small"
                        margin="dense"
                        defaultValue={data.default_sell_price || ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    /{data.unit}
                                </InputAdornment>
                            ),
                            startAdornment: (
                                <InputAdornment position="start">
                                    Rp
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(validationErrors.default_sell_price)}
                        helperText={validationErrors.default_sell_price}
                    />
                </Grid>
            </Grid>

            <FormActions
                disabled={loading}
                deleting={deleting}
                onDelete={data.deleted_at ? undefined : handleDelete}
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
