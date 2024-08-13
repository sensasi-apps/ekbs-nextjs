// types
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type Transaction from '@/dataTypes/Transaction'
import type ProductMovementPurchase from '@/dataTypes/mart/ProductMovementPurchase'
// vendors
import { Field, FieldArray, FieldProps, type FormikProps } from 'formik'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import FormikForm, { DateField, TextField } from '@/components/FormikForm'
import TextFieldDefault from '@/components/TextField'
import SelectFromApi from '@/components/Global/SelectFromApi'
// local components
import ProductMovementDetailArrayFields from './Form/ProductMovementDetailArrayFields'
import ProductMovementCostArrayFields from './Form/ProductMovementCostArrayFields'
// enums
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import ProductMovementDetail from '@/dataTypes/ProductMovementDetail'

export default function Form({
    isSubmitting,
    dirty,
    values,
    status,
}: FormikProps<FormValues>) {
    const dataFromDb: ProductMovement = status

    const isDisabled =
        isSubmitting ||
        !!dataFromDb?.purchase?.received ||
        !!dataFromDb?.purchase?.paid

    return (
        <FormikForm
            id="product-form"
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
                </Grid2>

                <Grid2 xs={12} sm={9} smOffset={3}>
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
        qty: ProductMovementDetail['qty']
        rp_per_unit: ProductMovementDetail['rp_per_unit']
        cost_rp_total: number
    }[]

    costs: ProductMovement['costs']
}>
