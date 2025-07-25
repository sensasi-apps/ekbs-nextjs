// types
import type Product from '@/dataTypes/mart/Product'
// vendors
import {
    FastField,
    FieldArray,
    type FieldProps,
    type FormikProps,
} from 'formik'
import Autocomplete from '@mui/material/Autocomplete'
import MuiTextField from '@mui/material/TextField'
import useSWR from 'swr'
// materials
import Alert from '@mui/material/Alert'
import Grid2 from '@mui/material/Grid2'
// components
import FormikForm, { NumericField, TextField } from '@/components/FormikForm'
import ProductWarehouseArrayFields from './Form/ProductWarehouseArrayFields'
// utils
import toDmy from '@/utils/toDmy'

export default function ProductForm({
    isSubmitting,
    dirty,
    setSubmitting,
    status,
}: FormikProps<FormValues>) {
    const {
        product: dataFromDb,
        handleDelete,
    }: {
        product: Product | undefined
        handleDelete: () => Promise<void>
    } = status

    const { data: categoryNames = [] } = useSWR<string[]>(
        'marts/products/categories-data',
    )

    const isDisabled = isSubmitting

    return (
        <FormikForm
            id="product-form"
            dirty={dirty || Boolean(dataFromDb?.deleted_at)}
            submitting={isSubmitting}
            processing={isSubmitting}
            isNew={!dataFromDb?.id}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                deleteButton: {
                    titleText: 'Nonaktifkan Produk',
                    confirmationText:
                        'Produk yang dinonaktifkan tidak akan muncul di daftar produk',
                    disabled: isDisabled || Boolean(dataFromDb?.deleted_at),
                    onClick: dataFromDb?.id
                        ? () => {
                              setSubmitting(true)
                              handleDelete().finally(() => setSubmitting(false))
                          }
                        : undefined,
                    children: 'Nonaktifkan Produk',
                },
            }}>
            {dataFromDb?.deleted_at && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 1,
                    }}>
                    Produk telah dinonaaktifkan pada tanggal{' '}
                    {toDmy(dataFromDb.deleted_at)}, silahkan klik tombol
                    &quot;simpan&quot; untuk mengaktifkan kembali
                </Alert>
            )}

            <Grid2 container columnSpacing={1.5}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="name"
                        label="Nama"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                        }}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="code"
                        label="Kode"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                            required: false,
                        }}
                    />
                </Grid2>
            </Grid2>

            <TextField
                name="barcode_reg_id"
                label="Barcode"
                disabled={isDisabled}
                textFieldProps={{
                    variant: 'standard',
                    required: false,
                }}
            />

            <FastField name="category_name">
                {({ field }: FieldProps<string>) => (
                    <Autocomplete
                        freeSolo
                        options={categoryNames ?? []}
                        value={field.value}
                        onChange={(_, value) =>
                            field.onChange({
                                target: {
                                    name: field.name,
                                    value,
                                },
                            })
                        }
                        renderInput={params => (
                            <MuiTextField
                                {...params}
                                {...field}
                                required
                                margin="normal"
                                label="Kategori"
                                disabled={isDisabled}
                                variant="standard"
                            />
                        )}
                    />
                )}
            </FastField>

            <TextField
                name="description"
                label="Deskripsi"
                disabled={isDisabled}
                textFieldProps={{
                    variant: 'standard',
                    required: false,
                    multiline: true,
                }}
            />

            <Grid2 container columnSpacing={1.5} mb={2}>
                <Grid2 size={{ xs: 12, sm: 8 }}>
                    <NumericField
                        name="low_number"
                        label="Persediaan Menipis Pada"
                        disabled={isDisabled}
                        numericFormatProps={{
                            variant: 'standard',
                            required: false,
                            inputProps: {
                                minLength: 1,
                                maxLength: 19,
                            },
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                        name="unit"
                        label="Satuan"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                        }}
                    />
                </Grid2>
            </Grid2>

            <FieldArray
                name="warehouses"
                render={props => (
                    <ProductWarehouseArrayFields
                        disabled={isDisabled}
                        {...props}
                    />
                )}
            />
        </FormikForm>
    )
}

export type FormValues = Partial<{
    name: string
    code?: string
    category_name?: string
    description?: string
    low_number?: number
    unit: string
    warehouses: Product['warehouses']
}>
