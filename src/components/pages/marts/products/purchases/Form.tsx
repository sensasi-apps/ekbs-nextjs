// types
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type Transaction from '@/dataTypes/Transaction'
import type ProductMovementPurchase from '@/dataTypes/mart/ProductMovementPurchase'
import ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
// vendors
import { Field, FieldArray, FieldProps, type FormikProps } from 'formik'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import FormikForm, { DateField, TextField } from '@/components/FormikForm'
import TextFieldDefault from '@/components/TextField'
import SelectFromApi from '@/components/Global/SelectFromApi'
// local components
import { PmdsTable } from './Form/PmdsTable'
import { CostsTable } from './Form/CostsTable'
import ProductMovementDetailArrayFields from './Form/ProductMovementDetailArrayFields'
import ProductMovementCostArrayFields from './Form/ProductMovementCostArrayFields'
// enums
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import { Box, FormHelperText } from '@mui/material'

export default function Form({
    isSubmitting,
    errors,
    dirty,
    values,
    status,
}: FormikProps<FormValues>) {
    const dataFromDb: ProductMovement = status

    const isDisabled =
        isSubmitting ||
        !!dataFromDb?.finished_at ||
        !!dataFromDb?.purchase?.received ||
        !!dataFromDb?.purchase?.paid

    return (
        <FormikForm
            id="product-purchase-form"
            dirty={dirty}
            submitting={isSubmitting}
            processing={isSubmitting}
            isNew={!dataFromDb?.uuid}
            slotProps={{
                submitButton: {
                    disabled: !(dirty || isSubmitting),
                },
            }}>
            <Grid2 container spacing={4}>
                <Grid2
                    xs={12}
                    sm={3}
                    sx={{
                        position: {
                            sm: 'absolute',
                        },
                    }}>
                    {dataFromDb?.short_uuid && (
                        <TextFieldDefault
                            label="Kode"
                            disabled
                            required={false}
                            value={dataFromDb.short_uuid}
                        />
                    )}

                    <DateField
                        name="at"
                        label="Tanggal"
                        disabled={isDisabled}
                    />

                    <TextField
                        name="note"
                        label="Catatan"
                        disabled={isDisabled}
                        textFieldProps={{
                            required: false,
                            multiline: true,
                            minRows: 2,
                        }}
                    />

                    <DateField
                        name="received"
                        label="Tanggal Terima"
                        disabled={
                            isSubmitting || !!dataFromDb?.purchase?.received
                        }
                        textFieldProps={{
                            required: false,
                        }}
                    />

                    <DateField
                        name="paid"
                        label="Tanggal Bayar"
                        disabled={isSubmitting || !!dataFromDb?.purchase?.paid}
                        textFieldProps={{
                            required: false,
                        }}
                    />

                    <Field name="cashable_uuid">
                        {({
                            field: { name, value, onChange },
                            meta: { error },
                        }: FieldProps) => {
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.5em',
                                    }}>
                                    <SelectFromApi
                                        required
                                        endpoint="/data/cashes"
                                        label="Dari Kas"
                                        size="small"
                                        margin="dense"
                                        disabled={
                                            isSubmitting ||
                                            !values.paid ||
                                            !!dataFromDb?.purchase?.paid
                                        }
                                        selectProps={{
                                            value: value ?? '',
                                            name: name,
                                        }}
                                        onChange={onChange}
                                        {...errorsToHelperTextObj(error)}
                                    />
                                </div>
                            )
                        }}
                    </Field>

                    {JSON.stringify(errors) !== '{}' && (
                        <FormHelperText error component="ul">
                            {Object.values(errors)
                                .flatMap(v => v)
                                .filter(Boolean)
                                .map((v, i) => (
                                    <Box component="li" key={i}>
                                        {JSON.stringify(v)}
                                    </Box>
                                ))}
                        </FormHelperText>
                    )}
                </Grid2>

                <Grid2 xs={12} sm={9} smOffset={3}>
                    {dataFromDb?.finished_at ? (
                        <CostsTable data={dataFromDb.costs} />
                    ) : (
                        <FieldArray
                            name="costs"
                            render={props => (
                                <ProductMovementCostArrayFields
                                    disabled={
                                        isDisabled ||
                                        Boolean(values.paid || values.received)
                                    }
                                    {...props}
                                />
                            )}
                        />
                    )}

                    {dataFromDb?.finished_at ? (
                        <PmdsTable data={dataFromDb.details} />
                    ) : (
                        <FieldArray
                            name="details"
                            render={props => (
                                <ProductMovementDetailArrayFields
                                    disabled={
                                        isDisabled ||
                                        Boolean(values.paid || values.received)
                                    }
                                    {...props}
                                />
                            )}
                        />
                    )}
                </Grid2>
            </Grid2>
        </FormikForm>
    )
}

export type FormValues = Partial<{
    at: ProductMovement['at']
    // type: ProductMovement['type']
    // warehouse: ProductMovement['warehouse']
    note: ProductMovement['note']

    received: ProductMovementPurchase['received']
    paid: ProductMovementPurchase['paid']
    cashable_uuid: Transaction['cashable_uuid']

    details: {
        product: ProductMovementDetail['product']
        product_id: ProductMovementDetail['product_id']
        qty: ProductMovementDetail['qty']
        rp_per_unit: ProductMovementDetail['rp_per_unit']
        cost_rp_per_unit: ProductMovementDetail['cost_rp_per_unit']
    }[]

    costs: ProductMovement['costs']
}>
