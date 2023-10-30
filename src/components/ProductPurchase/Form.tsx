import type { KeyedMutator } from 'swr'
import type ProductType from '@/dataTypes/Product'
import type ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'

import { FC, FormEvent, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import useSWR from 'swr'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import useFormData from '@/providers/useFormData'
import FormActions from '../Global/Form/Actions'
import axios from '@/lib/axios'
import useValidationErrors from '@/hooks/useValidationErrors'
import DatePicker from '../Global/DatePicker'
import dmyToYmd from '@/utils/dmyToYmd'
import SelectFromApi from '../Global/SelectFromApi'

const ProductPurchaseForm: FC<{
    parentDatatableMutator: KeyedMutator<any>
}> = ({ parentDatatableMutator }) => {
    const { data, isDirty, handleClose, loading, setSubmitting } =
        useFormData<ProductPurchaseType>()
    const { validationErrors, setValidationErrors } = useValidationErrors()

    const [productMovementDetails, setProductMovementDetails] = useState<
        ProductMovementDetailType[]
    >(data.product_movement_details ?? [{}])

    const [paidAt, setPaidAt] = useState<string | undefined>(data.paid)

    const { data: products } = useSWR('/farm-inputs/products/datatable', url =>
        axios.get(url).then(res => res.data.data),
    )

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget
        if (formEl.checkValidity() === false) {
            event.stopPropagation()
            return formEl.reportValidity()
        }

        const formData: any = Object.fromEntries(new FormData(formEl).entries())

        formData.pmds = productMovementDetails
        formData.order = dmyToYmd(formData.order)
        formData.due = dmyToYmd(formData.due)
        formData.paid = dmyToYmd(formData.paid)
        formData.received = dmyToYmd(formData.received)

        setSubmitting(true)

        axios
            .post(
                `/farm-inputs/product-purchases${
                    data.uuid ? '/' + data.uuid : ''
                }`,
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
            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        defaultValue={data.order}
                        disabled={loading}
                        label="Tanggal Pesan"
                        slotProps={{
                            textField: {
                                required: true,
                                margin: 'dense',
                                name: 'order',
                                fullWidth: true,
                                size: 'small',
                                error: Boolean(validationErrors.order),
                                helperText: validationErrors.order,
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        defaultValue={data.due}
                        disabled={loading}
                        label="Tanggal Jatuh Tempo"
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                name: 'due',
                                fullWidth: true,
                                size: 'small',
                                error: Boolean(validationErrors.due),
                                helperText: validationErrors.due,
                            },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={paidAt || null}
                        disabled={loading}
                        label="Tanggal Bayar"
                        onChange={date => setPaidAt(date?.format('YYYY-MM-DD'))}
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                name: 'paid',
                                fullWidth: true,
                                size: 'small',
                                error: Boolean(validationErrors.paid),
                                helperText: validationErrors.paid,
                            },
                        }}
                    />

                    {paidAt && (
                        <SelectFromApi
                            disabled={loading}
                            fullWidth
                            endpoint="/data/cashes"
                            label="Dari kas"
                            required
                            size="small"
                            margin="dense"
                            selectProps={{
                                name: 'cashable_uuid',
                            }}
                            defaultValue={data.transaction?.cash.uuid || ''}
                            error={Boolean(validationErrors.cashable_uuid)}
                            helperText={validationErrors.cashable_uuid}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        defaultValue={data.received}
                        disabled={loading}
                        label="Tanggal Barang Diterima"
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                name: 'received',
                                fullWidth: true,
                                size: 'small',
                                error: Boolean(validationErrors.received),
                                helperText: validationErrors.received,
                            },
                        }}
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
                sx={{ mt: 2 }}
                defaultValue={data.note || ''}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
            />

            <Typography variant="h6" component="h2" mt={2} mb={0.5}>
                Daftar Produk
            </Typography>

            {productMovementDetails.map((row, index) => (
                <Grid
                    key={index}
                    mb={2}
                    container
                    columnSpacing={2}
                    rowSpacing={1}>
                    <Grid item xs={12} sm={2}>
                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            disabled={loading}
                            label="Jumlah"
                            allowNegative={false}
                            required
                            size="small"
                            thousandSeparator="."
                            decimalSeparator=","
                            min="1"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {row.product?.unit}
                                    </InputAdornment>
                                ),
                            }}
                            onValueChange={({ floatValue }) =>
                                setProductMovementDetails(prev => [
                                    ...prev.slice(0, index),
                                    {
                                        ...prev[index],
                                        qty: floatValue || undefined,
                                    },
                                    ...prev.slice(index + 1),
                                ])
                            }
                            value={row.qty || ''}
                            error={Boolean(
                                validationErrors[`pmds.${index}.qty`],
                            )}
                            helperText={validationErrors[`pmds.${index}.qty`]}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            fullWidth
                            disablePortal
                            options={products ?? []}
                            disabled={loading}
                            getOptionLabel={(option: ProductType) =>
                                `#${option.id} - ${option.name}`
                            }
                            value={row.product || null}
                            onChange={(_, product) => {
                                setProductMovementDetails(prev => [
                                    ...prev.slice(0, index),
                                    {
                                        ...prev[index],
                                        product_id: product?.id,
                                        product: product || undefined,
                                    },
                                    ...prev.slice(index + 1),
                                ])
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    required
                                    size="small"
                                    label="Produk"
                                    error={Boolean(
                                        validationErrors[
                                            `pmds.${index}.product_id`
                                        ],
                                    )}
                                    helperText={
                                        validationErrors[
                                            `pmds.${index}.product_id`
                                        ]
                                    }
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            disabled={loading}
                            label="Harga"
                            allowNegative={false}
                            min="1"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        Rp
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {row.product?.unit ? '/' : ''}
                                        {row.product?.unit}
                                    </InputAdornment>
                                ),
                            }}
                            required
                            value={row.rp_per_unit || ''}
                            onValueChange={({ floatValue }) =>
                                setProductMovementDetails(prev => [
                                    ...prev.slice(0, index),
                                    {
                                        ...prev[index],
                                        rp_per_unit: floatValue,
                                    },
                                    ...prev.slice(index + 1),
                                ])
                            }
                            size="small"
                            thousandSeparator="."
                            decimalSeparator=","
                            error={Boolean(
                                validationErrors[`pmds.${index}.rp_per_unit`],
                            )}
                            helperText={
                                validationErrors[`pmds.${index}.rp_per_unit`]
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            disabled={loading}
                            allowNegative={false}
                            min="1"
                            label="Total"
                            name="total"
                            required
                            size="small"
                            thousandSeparator="."
                            decimalSeparator=","
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        Rp
                                    </InputAdornment>
                                ),
                            }}
                            value={
                                (row.qty || 0) * (row.rp_per_unit || 0) || ''
                            }
                            onValueChange={({ floatValue }) =>
                                setProductMovementDetails(prev => [
                                    ...prev.slice(0, index),
                                    {
                                        ...prev[index],
                                        rp_per_unit: floatValue
                                            ? Math.ceil(
                                                  floatValue / (row.qty || 0),
                                              )
                                            : undefined,
                                    },
                                    ...prev.slice(index + 1),
                                ])
                            }
                        />
                    </Grid>
                </Grid>
            ))}

            <Grid container fontWeight="bold" fontSize="1.1rem">
                <Grid item xs={9} textAlign="center">
                    TOTAL
                </Grid>

                <Grid item xs={3}>
                    <NumericFormat
                        value={productMovementDetails.reduce(
                            (acc, cur) =>
                                acc + (cur.qty || 0) * (cur.rp_per_unit || 0),
                            0,
                        )}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                        displayType="text"
                    />
                </Grid>
            </Grid>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    marginBottom: '2rem',
                }}>
                <Button
                    disabled={loading}
                    color="success"
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        setProductMovementDetails(prev => [...prev, {} as any])
                    }>
                    Tambah Produk
                </Button>

                <Button
                    disabled={productMovementDetails.length === 1 || loading}
                    color="error"
                    size="small"
                    onClick={() =>
                        setProductMovementDetails(prev => prev.slice(0, -1))
                    }>
                    Hapus Produk
                </Button>
            </div>

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

export default ProductPurchaseForm
