// types
import type { UUID } from 'crypto'
import type ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'
import type CashType from '@/dataTypes/Cash'
// vendors
import { memo } from 'react'
import dayjs from 'dayjs'
import { FastField, FormikProps } from 'formik'
// materials
import Grid from '@mui/material/Grid'
// components
import DatePicker from '@/components/DatePickerDayJs/DatePicker'
import FormikForm from '@/components/FormikForm'
import SelectFromApi from '@/components/Global/SelectFromApi'
// import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import ProductMovementDetailArrayField from './Form/ProductMovementDetailArrayField'

const ProductPurchaseForm = memo(function ProductPurchaseForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        order,
        due,
        paid,
        received,
        product_movement_details,
        cashable_uuid,
    },
    status,
    setFieldValue,
}: FormikProps<typeof EMPTY_FORM_DATA>) {
    const isNew = !status.uuid
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || status.hasTransaction

    return (
        <FormikForm
            id="product-purchase-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    // disabled: isDisabled,
                    disabled: false,
                },
            }}>
            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={order ? dayjs(order) : null}
                        disabled={isDisabled}
                        label="Tanggal Pesan"
                        onChange={date =>
                            setFieldValue('order', date?.format('YYYY-MM-DD'))
                        }
                        slotProps={{
                            textField: {
                                name: 'order',
                                ...errorsToHelperTextObj(errors.order),
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={due ? dayjs(due) : null}
                        disabled={isDisabled}
                        minDate={order ? dayjs(order) : undefined}
                        label="Tanggal Jatuh Tempo"
                        onChange={date =>
                            setFieldValue('due', date?.format('YYYY-MM-DD'))
                        }
                        slotProps={{
                            textField: {
                                required: false,
                                name: 'due',
                                ...errorsToHelperTextObj(errors.due),
                            },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={paid ? dayjs(paid) : null}
                        minDate={order ? dayjs(order) : undefined}
                        disabled={isDisabled}
                        label="Tanggal Bayar"
                        onChange={date =>
                            setFieldValue('paid', date?.format('YYYY-MM-DD'))
                        }
                        slotProps={{
                            textField: {
                                name: 'paid',
                                required: false,
                                ...errorsToHelperTextObj(errors.paid),
                            },
                        }}
                    />

                    {paid && (
                        <SelectFromApi
                            disabled={isDisabled}
                            endpoint="/data/cashes"
                            label="Dari kas"
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            selectProps={{
                                name: 'cashable_uuid',
                                value: cashable_uuid ?? '',
                            }}
                            onValueChange={(value: CashType) =>
                                setFieldValue('cashable_uuid', value.uuid)
                            }
                            {...errorsToHelperTextObj(errors.cashable_uuid)}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={received ? dayjs(received) : null}
                        minDate={order ? dayjs(order) : undefined}
                        disabled={isDisabled}
                        label="Tanggal Barang Diterima"
                        onChange={date =>
                            setFieldValue(
                                'received',
                                date?.format('YYYY-MM-DD'),
                            )
                        }
                        slotProps={{
                            textField: {
                                required: false,
                                name: 'received',
                                ...errorsToHelperTextObj(errors.received),
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <FastField
                name="note"
                component={TextFieldFastableComponent}
                required={false}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan"
                sx={{ mt: 2 }}
                {...errorsToHelperTextObj(errors.note)}
            />

            <ProductMovementDetailArrayField
                errors={errors}
                data={product_movement_details}
                disabled={isDisabled}
            />
        </FormikForm>
    )
})

export default ProductPurchaseForm

export const EMPTY_FORM_DATA: {
    order: null | ProductPurchaseType['order']
    due: null | ProductPurchaseType['due']
    paid: null | ProductPurchaseType['paid']
    received: null | ProductPurchaseType['received']
    note: '' | ProductPurchaseType['note']
    cashable_uuid?: UUID
    product_movement_details: ProductMovementDetailType[]
} = {
    order: null,
    due: null,
    paid: null,
    received: null,
    note: '',
    cashable_uuid: undefined,
    product_movement_details: [{} as ProductMovementDetailType],
}

export const EMPTY_FORM_STATUS: {
    uuid: null | ProductPurchaseType['uuid']
    hasTransaction: boolean
} = {
    uuid: null,
    hasTransaction: false,
}
