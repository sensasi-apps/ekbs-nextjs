// types
import type Product from '@/modules/mart/types/orms/product'
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
import Grid from '@mui/material/Grid'
// components
import FormikForm from '@/components/formik-form'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import ProductWarehouseArrayFields from './Form/ProductWarehouseArrayFields'
// utils
import toDmy from '@/utils/to-dmy'

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

            <Grid container columnSpacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="name"
                        label="Nama"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="code"
                        label="Kode"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                            required: false,
                        }}
                    />
                </Grid>
            </Grid>

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

            <Grid container columnSpacing={1.5} mb={2}>
                <Grid size={{ xs: 12, sm: 8 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        name="unit"
                        label="Satuan"
                        disabled={isDisabled}
                        textFieldProps={{
                            variant: 'standard',
                        }}
                    />
                </Grid>
            </Grid>

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
