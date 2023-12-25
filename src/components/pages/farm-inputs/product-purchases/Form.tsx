// types
import type { UUID } from 'crypto'
import type ProductPurchaseType from '@/dataTypes/ProductPurchase'
import type CashType from '@/dataTypes/Cash'
// vendors
import { memo } from 'react'
import dayjs from 'dayjs'
import { FastField, FieldArray, FormikProps } from 'formik'
// materials
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import Grid2 from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/FormikForm'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// sub components
import ProductMovementCostArrayField from './Form/ProductMovementCostArrayField'
import ProductMovementDetailArrayField from './Form/ProductMovementDetailArrayField'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import numberToCurrency from '@/utils/numberToCurrency'

const ProductPurchaseForm = memo(function ProductPurchaseForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        order,
        due,
        paid,
        received,
        product_movement,
        product_movement_details,
        cashable_uuid,
    },
    status,
    setFieldValue,
}: FormikProps<
    Partial<
        ProductPurchaseType & {
            cashable_uuid?: UUID
        }
    >
>) {
    const isNew = !status.uuid
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || status.hasTransaction
    const { costs } = product_movement ?? {}

    const totalRpCost = (costs ?? []).reduce(
        (acc, cur) => acc + (cur?.rp ?? 0),
        0,
    )
    const totalRpCostItem = (product_movement_details ?? []).reduce(
        (acc, cur) => acc + (cur.rp_cost_per_unit ?? 0) * (cur.qty ?? 0),
        0,
    )

    const totalPrice = (product_movement_details ?? []).reduce(
        (acc, cur) => acc + (cur.qty ?? 0) * (cur.rp_per_unit ?? 0),
        0,
    )

    const isCostMatch = totalRpCost === totalRpCostItem

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
                    disabled: isDisabled || !isCostMatch,
                },
            }}>
            <Container maxWidth="xs" disableGutters>
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

                <DatePicker
                    value={received ? dayjs(received) : null}
                    minDate={order ? dayjs(order) : undefined}
                    disabled={isDisabled}
                    label="Tanggal Barang Diterima"
                    onChange={date =>
                        setFieldValue('received', date?.format('YYYY-MM-DD'))
                    }
                    slotProps={{
                        textField: {
                            required: false,
                            name: 'received',
                            ...errorsToHelperTextObj(errors.received),
                        },
                    }}
                />

                <Fade in={!!received} unmountOnExit>
                    <span>
                        <DatePicker
                            value={paid ? dayjs(paid) : null}
                            minDate={order ? dayjs(order) : undefined}
                            disabled={isDisabled || !received}
                            label="Tanggal Bayar"
                            onChange={date =>
                                setFieldValue(
                                    'paid',
                                    date?.format('YYYY-MM-DD'),
                                )
                            }
                            slotProps={{
                                textField: {
                                    name: 'paid',
                                    required: false,
                                    ...errorsToHelperTextObj(errors.paid),
                                },
                            }}
                        />
                    </span>
                </Fade>

                <Fade in={!!paid} unmountOnExit>
                    <span>
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
                    </span>
                </Fade>

                <FastField
                    name="note"
                    component={TextFieldFastableComponent}
                    required={false}
                    multiline
                    disabled={isDisabled}
                    rows={2}
                    label="Catatan"
                    {...errorsToHelperTextObj(errors.note)}
                />
            </Container>

            <FieldArray
                name="product_movement.costs"
                render={props => (
                    <ProductMovementCostArrayField
                        {...props}
                        errors={errors}
                        data={costs}
                        disabled={isDisabled}
                    />
                )}
            />

            {costs && costs.length > 0 && (
                <Grid2 container spacing={2} mt={0}>
                    <Grid2 xs={4} textAlign="right">
                        TOTAL
                    </Grid2>
                    <Grid2 xs={3} pl={2}>
                        {numberToCurrency(totalRpCost)}
                    </Grid2>
                </Grid2>
            )}

            <FieldArray
                name="product_movement_details"
                render={props => (
                    <ProductMovementDetailArrayField
                        {...props}
                        errors={errors}
                        totalRpCost={totalRpCost}
                        data={product_movement_details ?? [{} as any]}
                        disabled={isDisabled}
                    />
                )}
            />

            <Grid2 container spacing={2} mt={0} mb={2}>
                <Grid2 xs={7.5} textAlign="right">
                    TOTAL
                </Grid2>
                <Grid2 xs={2.5} pl={2}>
                    {numberToCurrency(totalPrice)}
                </Grid2>
                <Grid2 xs={2} pl={2}>
                    {numberToCurrency(totalRpCostItem)}
                    {!isCostMatch && (
                        <Typography
                            variant="caption"
                            color="error"
                            component="div">
                            Biaya tidak sinkron
                        </Typography>
                    )}
                </Grid2>
            </Grid2>
        </FormikForm>
    )
})

export default ProductPurchaseForm

export const EMPTY_FORM_STATUS: {
    uuid: null | ProductPurchaseType['uuid']
    hasTransaction: boolean
} = {
    uuid: null,
    hasTransaction: false,
}
