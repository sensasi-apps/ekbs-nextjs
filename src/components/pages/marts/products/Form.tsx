// types

// materials
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import MuiTextField from '@mui/material/TextField'
// vendors
import {
    FastField,
    FieldArray,
    type FieldProps,
    type FormikProps,
} from 'formik'
import useSWR from 'swr'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
import type Product from '@/modules/mart/types/orms/product'
// utils
import toDmy from '@/utils/to-dmy'
import ProductWarehouseArrayFields from './Form/ProductWarehouseArrayFields'

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
            dirty={dirty || Boolean(dataFromDb?.deleted_at)}
            id="product-form"
            isNew={!dataFromDb?.id}
            processing={isSubmitting}
            slotProps={{
                deleteButton: {
                    children: 'Nonaktifkan Produk',
                    confirmationText:
                        'Produk yang dinonaktifkan tidak akan muncul di daftar produk',
                    disabled: isDisabled || Boolean(dataFromDb?.deleted_at),
                    onClick: dataFromDb?.id
                        ? () => {
                              setSubmitting(true)
                              handleDelete().finally(() => setSubmitting(false))
                          }
                        : undefined,
                    titleText: 'Nonaktifkan Produk',
                },
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
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

            <Grid columnSpacing={1.5} container>
                <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                        disabled={isDisabled}
                        label="Nama"
                        name="name"
                        textFieldProps={{
                            variant: 'standard',
                        }}
                    />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                        disabled={isDisabled}
                        label="Kode"
                        name="code"
                        textFieldProps={{
                            required: false,
                            variant: 'standard',
                        }}
                    />
                </Grid>
            </Grid>

            <TextField
                disabled={isDisabled}
                label="Barcode"
                name="barcode_reg_id"
                textFieldProps={{
                    required: false,
                    variant: 'standard',
                }}
            />

            <FastField name="category_name">
                {({ field }: FieldProps<string>) => (
                    <Autocomplete
                        freeSolo
                        onChange={(_, value) =>
                            field.onChange({
                                target: {
                                    name: field.name,
                                    value,
                                },
                            })
                        }
                        options={categoryNames ?? []}
                        renderInput={params => (
                            <MuiTextField
                                {...params}
                                {...field}
                                disabled={isDisabled}
                                label="Kategori"
                                margin="normal"
                                required
                                variant="standard"
                            />
                        )}
                        value={field.value}
                    />
                )}
            </FastField>

            <TextField
                disabled={isDisabled}
                label="Deskripsi"
                name="description"
                textFieldProps={{
                    multiline: true,
                    required: false,
                    variant: 'standard',
                }}
            />

            <Grid columnSpacing={1.5} container mb={2}>
                <Grid size={{ sm: 8, xs: 12 }}>
                    <NumericField
                        disabled={isDisabled}
                        label="Persediaan Menipis Pada"
                        name="low_number"
                        numericFormatProps={{
                            inputProps: {
                                maxLength: 19,
                                minLength: 1,
                            },
                            required: false,
                            variant: 'standard',
                        }}
                    />
                </Grid>
                <Grid size={{ sm: 4, xs: 12 }}>
                    <TextField
                        disabled={isDisabled}
                        label="Satuan"
                        name="unit"
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
