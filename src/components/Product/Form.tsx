// types
import type Product from '@/types/orms/product'
import {
    FastField,
    FieldArray,
    type FormikErrors,
    type FormikProps,
} from 'formik'
// materials
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/GridLegacy'
// components
import NumericFormat from '@/components/NumericFormat'
// utils
import toDmy from '@/utils/to-dmy'
import FormikForm from '@/components/formik-form'
import TextFieldFastableComponent from '../TextField/FastableComponent'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ProductWarehouseArrayFields from './Form/ProductWarehouseArrayFields'

export default function ProductForm({
    values,
    isSubmitting,
    dirty,
    setFieldValue,
    errors,
}: Omit<FormikProps<Partial<Product>>, 'errors'> & {
    errors: FormikErrors<Product>
}) {
    const isDisabled = isSubmitting

    return (
        <FormikForm
            id="product-form"
            dirty={dirty}
            submitting={isSubmitting}
            processing={isSubmitting}
            isNew={!values.id}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                deleteButton: {
                    disabled: isDisabled,
                },
            }}>
            {values.deleted_at && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 1,
                    }}>
                    Produk telah dinonaaktifkan pada tanggal{' '}
                    {toDmy(values.deleted_at)}, silahkan klik tombol
                    &quot;simpan&quot; untuk mengaktifkan kembali
                </Alert>
            )}

            <Grid container columnSpacing={1.5}>
                <Grid item xs={12} sm={6}>
                    <FastField
                        name="name"
                        label="Nama"
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        variant="standard"
                        {...errorsToHelperTextObj(errors.name)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FastField
                        name="code"
                        label="Kode"
                        component={TextFieldFastableComponent}
                        required={false}
                        disabled={isDisabled}
                        variant="standard"
                        {...errorsToHelperTextObj(errors.code)}
                    />
                </Grid>
            </Grid>

            <FastField
                name="category_name"
                label="Kategori"
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                variant="standard"
                {...errorsToHelperTextObj(errors.category_name)}
            />

            <FastField
                name="description"
                label="Deskripsi"
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                variant="standard"
                required={false}
                multiline
                minRows={2}
                {...errorsToHelperTextObj(errors.description)}
            />

            <Grid container columnSpacing={1.5} mb={2}>
                <Grid item xs={12} sm={8}>
                    <NumericFormat
                        disabled={isDisabled}
                        required={false}
                        label="Persediaan Menipis Pada"
                        variant="standard"
                        value={values.low_number}
                        name="low_number"
                        onValueChange={({ floatValue }) =>
                            setFieldValue('low_number', floatValue)
                        }
                        inputProps={{
                            minLength: 1,
                            maxLength: 19,
                        }}
                        {...errorsToHelperTextObj(errors.low_number)}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FastField
                        name="unit"
                        label="Satuan"
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        variant="standard"
                        {...errorsToHelperTextObj(errors.unit)}
                    />
                </Grid>
            </Grid>

            <FieldArray
                name="warehouses"
                render={props => (
                    <ProductWarehouseArrayFields
                        {...props}
                        data={values.warehouses ?? []}
                        errors={errors.warehouses}
                        disabled={isDisabled}
                    />
                )}
            />
        </FormikForm>
    )
}
