// types

// materials
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/GridLegacy'
import {
    FastField,
    FieldArray,
    type FormikErrors,
    type FormikProps,
} from 'formik'
import FormikForm from '@/components/formik-form'
// components
import NumericFormat from '@/components/numeric-format'
import type Product from '@/modules/farm-inputs/types/orms/product'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import toDmy from '@/utils/to-dmy'
import TextFieldFastableComponent from '../TextField/FastableComponent'
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
            dirty={dirty}
            id="product-form"
            isNew={!values.id}
            processing={isSubmitting}
            slotProps={{
                deleteButton: {
                    disabled: isDisabled,
                },
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
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

            <Grid columnSpacing={1.5} container>
                <Grid item sm={6} xs={12}>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Nama"
                        name="name"
                        variant="standard"
                        {...errorsToHelperTextObj(errors.name)}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Kode"
                        name="code"
                        required={false}
                        variant="standard"
                        {...errorsToHelperTextObj(errors.code)}
                    />
                </Grid>
            </Grid>

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Kategori"
                name="category_name"
                variant="standard"
                {...errorsToHelperTextObj(errors.category_name)}
            />

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Deskripsi"
                minRows={2}
                multiline
                name="description"
                required={false}
                variant="standard"
                {...errorsToHelperTextObj(errors.description)}
            />

            <Grid columnSpacing={1.5} container mb={2}>
                <Grid item sm={8} xs={12}>
                    <NumericFormat
                        disabled={isDisabled}
                        inputProps={{
                            maxLength: 19,
                            minLength: 1,
                        }}
                        label="Persediaan Menipis Pada"
                        name="low_number"
                        onValueChange={({ floatValue }) =>
                            setFieldValue('low_number', floatValue)
                        }
                        required={false}
                        value={values.low_number}
                        variant="standard"
                        {...errorsToHelperTextObj(errors.low_number)}
                    />
                </Grid>
                <Grid item sm={4} xs={12}>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Satuan"
                        name="unit"
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
                        disabled={isDisabled}
                        errors={errors.warehouses}
                    />
                )}
            />
        </FormikForm>
    )
}
