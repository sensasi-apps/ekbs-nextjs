// types

// materials
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
// vendors
import { Field, FieldArray, type FieldProps, type FormikProps } from 'formik'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldDefault from '@/components/TextField'
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import type ProductMovementDetail from '@/modules/mart/types/orms/product-movement-detail'
import type ProductMovementPurchase from '@/modules/mart/types/orms/product-movement-purchase'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
// enums
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ProductMovementCostArrayFields from './form/cost-array-fields'
import { CostsTable } from './form/costs-table'
import ProductMovementDetailArrayFields from './form/detail-array-fields'
// local components
import { PmdsTable } from './form/pmds-table'

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
            dirty={dirty}
            id="product-purchase-form"
            isNew={!dataFromDb?.uuid}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: !(dirty || isSubmitting),
                },
            }}
            submitting={isSubmitting}>
            <Grid container spacing={4}>
                <Grid
                    size={{
                        sm: 3,
                        xs: 12,
                    }}
                    sx={{
                        position: {
                            sm: 'absolute',
                        },
                    }}>
                    {dataFromDb?.short_uuid && (
                        <TextFieldDefault
                            disabled
                            label="Kode"
                            required={false}
                            value={dataFromDb.short_uuid}
                        />
                    )}

                    <DateField
                        disabled={isDisabled}
                        label="Tanggal"
                        name="at"
                    />

                    <TextField
                        disabled={isDisabled}
                        label="Catatan"
                        name="note"
                        textFieldProps={{
                            minRows: 2,
                            multiline: true,
                            required: false,
                        }}
                    />

                    <DateField
                        disabled={
                            isSubmitting || !!dataFromDb?.purchase?.received
                        }
                        label="Tanggal Terima"
                        name="received"
                        textFieldProps={{
                            required: false,
                        }}
                    />

                    <DateField
                        disabled={isSubmitting || !!dataFromDb?.purchase?.paid}
                        label="Tanggal Bayar"
                        name="paid"
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
                                        disabled={
                                            isSubmitting ||
                                            !values.paid ||
                                            !!dataFromDb?.purchase?.paid
                                        }
                                        endpoint="/data/cashes"
                                        label="Dari Kas"
                                        margin="dense"
                                        onChange={onChange}
                                        required
                                        selectProps={{
                                            name: name,
                                            value: value ?? '',
                                        }}
                                        size="small"
                                        {...errorsToHelperTextObj(error)}
                                    />
                                </div>
                            )
                        }}
                    </Field>

                    {JSON.stringify(errors) !== '{}' && (
                        <FormHelperText component="ul" error>
                            {Object.values(errors)
                                .flatMap(
                                    (v: string | object | Array<object>) =>
                                        typeof v === 'string'
                                            ? [v]
                                            : Object.values(v).flatMap(v =>
                                                  Object.values(v),
                                              ),
                                )
                                .filter(Boolean)
                                .map((v, i) => (
                                    <Box component="li" key={i}>
                                        {v as string}
                                    </Box>
                                ))}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid
                    offset={{
                        sm: 3,
                    }}
                    size={{
                        sm: 9,
                        xs: 12,
                    }}>
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
                </Grid>
            </Grid>
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
    cashable_uuid: TransactionORM['cashable_uuid']

    details: {
        product: ProductMovementDetail['product']
        product_id: ProductMovementDetail['product_id']
        qty: ProductMovementDetail['qty']
        rp_per_unit: ProductMovementDetail['rp_per_unit']
        cost_rp_per_unit: ProductMovementDetail['cost_rp_per_unit']
    }[]

    costs: ProductMovement['costs']
}>
