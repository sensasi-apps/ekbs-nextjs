// types

import type { UUID } from 'node:crypto'
// materials
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import {
    FastField,
    FieldArray,
    type FormikErrors,
    type FormikProps,
} from 'formik'
import { memo } from 'react'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// enums
import Role from '@/enums/role'
// hooks
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type ProductPurchase from '@/modules/farm-inputs/types/orms/product-purchase'
import type CashType from '@/types/orms/cash'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
// sub components
import ProductMovementCostArrayField from './Form/ProductMovementCostArrayField'
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

        // product movement
        cashable_uuid,
        warehouse,
        costs,
    },
    status,
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const isAuthHasRole = useIsAuthHasRole()

    const isNew = !status.uuid
    const isPropcessing = isSubmitting
    const isDisabled =
        isPropcessing ||
        (status.hasTransaction && !isAuthHasRole(Role.FARM_INPUT_MANAGER))

    const isDisableProductMovementDetailFields =
        isDisabled || (received && !isAuthHasRole(Role.FARM_INPUT_MANAGER))

    const totalRpCost = (costs ?? []).reduce(
        (acc, cur) => acc + (cur?.rp ?? 0),
        0,
    )

    const totalRpCostItem =
        product_movement_details?.reduce(
            (acc, cur) => acc + (cur?.rp_cost_per_unit ?? 0) * (cur?.qty ?? 0),
            0,
        ) ?? 0

    const totalPrice =
        product_movement_details?.reduce(
            (acc, cur) => acc + (cur.qty ?? 0) * (cur.rp_per_unit ?? 0),
            0,
        ) ?? 0

    const isCostMatch =
        totalRpCost === totalRpCostItem ||
        Math.abs(totalRpCost - totalRpCostItem) < 0.0001

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="product-purchase-form"
            isNew={isNew}
            processing={isPropcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled || !isCostMatch,
                },
            }}
            submitting={isSubmitting}>
            <Container disableGutters maxWidth="xs">
                <DatePicker
                    disabled={isDisabled}
                    label="Tanggal Pesan"
                    maxDate={dayjs()}
                    onChange={date =>
                        setFieldValue('order', date?.format('YYYY-MM-DD'))
                    }
                    slotProps={{
                        textField: {
                            name: 'order',
                            ...errorsToHelperTextObj(errors.order),
                        },
                    }}
                    value={order ? dayjs(order) : null}
                />

                <DatePicker
                    disabled={isDisabled}
                    label="Tanggal Jatuh Tempo"
                    minDate={order ? dayjs(order) : undefined}
                    onChange={date =>
                        setFieldValue('due', date?.format('YYYY-MM-DD'))
                    }
                    slotProps={{
                        textField: {
                            name: 'due',
                            required: false,
                            ...errorsToHelperTextObj(errors.due),
                        },
                    }}
                    value={due ? dayjs(due) : null}
                />

                <DatePicker
                    disabled={isDisabled}
                    label="Tanggal Barang Diterima"
                    maxDate={dayjs()}
                    minDate={order ? dayjs(order) : undefined}
                    onChange={date =>
                        setFieldValue('received', date?.format('YYYY-MM-DD'))
                    }
                    slotProps={{
                        textField: {
                            name: 'received',
                            required:
                                Boolean(costs) && (costs ?? []).length > 0,
                            ...errorsToHelperTextObj(errors.received),
                        },
                    }}
                    value={received ? dayjs(received) : null}
                />

                <Fade in={!!received} unmountOnExit>
                    <span>
                        <FormControl
                            disabled={isDisabled}
                            margin="normal"
                            size="small">
                            <FormLabel id="gudang-buttons-group-label">
                                Gudang
                            </FormLabel>

                            <ToggleButtonGroup
                                aria-labelledby="gudang-buttons-group-label"
                                color="primary"
                                disabled={isDisabled}
                                exclusive
                                onChange={(_, value) =>
                                    setFieldValue('warehouse', value)
                                }
                                size="small"
                                value={warehouse}>
                                {Object.values(Warehouse).map(
                                    (warehouse, i) => (
                                        <ToggleButton key={i} value={warehouse}>
                                            {warehouse}
                                        </ToggleButton>
                                    ),
                                )}
                            </ToggleButtonGroup>

                            <FormHelperText error>
                                {errors?.warehouse}
                            </FormHelperText>
                        </FormControl>

                        <DatePicker
                            disabled={isDisabled || !received}
                            label="Tanggal Bayar"
                            maxDate={dayjs()}
                            minDate={order ? dayjs(order) : undefined}
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
                            value={paid ? dayjs(paid) : null}
                        />
                    </span>
                </Fade>

                <Fade in={!!paid} unmountOnExit>
                    <span>
                        <SelectFromApi
                            disabled={isDisabled}
                            endpoint="/data/cashes"
                            fullWidth
                            label="Dari kas"
                            margin="dense"
                            onValueChange={(value: CashType) =>
                                setFieldValue('cashable_uuid', value.uuid)
                            }
                            required
                            selectProps={{
                                name: 'cashable_uuid',
                                value: cashable_uuid ?? '',
                            }}
                            size="small"
                            {...errorsToHelperTextObj(errors.cashable_uuid)}
                        />
                    </span>
                </Fade>

                <FastField
                    component={TextFieldFastableComponent}
                    disabled={isDisabled}
                    label="Catatan"
                    multiline
                    name="note"
                    required={false}
                    rows={2}
                    {...errorsToHelperTextObj(errors.note)}
                />
            </Container>

            <FieldArray
                name="costs"
                render={props => (
                    <ProductMovementCostArrayField
                        {...props}
                        data={costs}
                        disabled={isDisableProductMovementDetailFields}
                        errors={
                            errors.costs as FormikErrors<
                                FormValuesType['costs']
                            >
                        }
                    />
                )}
            />

            {costs && costs.length > 0 && (
                <Grid container mt={0} spacing={2}>
                    <Grid size={{ xs: 4 }} textAlign="right">
                        TOTAL
                    </Grid>
                    <Grid pl={2} size={{ xs: 3 }}>
                        {numberToCurrency(totalRpCost)}
                    </Grid>
                </Grid>
            )}

            <FieldArray
                name="product_movement_details"
                render={props => (
                    <ProductMovementDetailArrayField
                        {...props}
                        data={product_movement_details ?? []}
                        disabled={isDisableProductMovementDetailFields}
                        errors={errors}
                        totalRpCost={totalRpCost}
                    />
                )}
            />

            <FormHelperText error>
                {errors?.product_movement_details?.toString()}
            </FormHelperText>

            <Grid container mb={2} mt={0} spacing={2}>
                <Grid size={{ sm: 7.5, xs: 4 }} textAlign="right">
                    TOTAL
                </Grid>

                <Grid pl={2} size={{ sm: 2.5, xs: 4 }}>
                    <Box
                        sx={{
                            display: {
                                sm: 'none',
                                xs: 'block',
                            },
                        }}>
                        <Typography variant="caption">Nilai Barang</Typography>
                    </Box>
                    {numberToCurrency(totalPrice)}
                </Grid>

                <Grid pl={2} size={{ sm: 2, xs: 4 }}>
                    <Box
                        sx={{
                            display: {
                                sm: 'none',
                                xs: 'block',
                            },
                        }}>
                        <Typography variant="caption">Biaya Lain</Typography>
                    </Box>

                    {numberToCurrency(totalRpCostItem)}

                    {!isCostMatch && (
                        <Typography
                            color="error"
                            component="div"
                            variant="caption">
                            Biaya tidak sinkron
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </FormikForm>
    )
})

export default ProductPurchaseForm

export type FormValuesType = Partial<{
    order: ProductPurchase['order']
    due: ProductPurchase['due']
    paid: ProductPurchase['paid']
    received: ProductPurchase['received']
    product_movement_details: ProductPurchase['product_movement_details']
    note: ProductPurchase['note']

    // product movement
    cashable_uuid: UUID
    warehouse: ProductPurchase['product_movement']['warehouse']
    costs: ProductPurchase['product_movement']['costs']
}>

export const EMPTY_FORM_STATUS: {
    uuid: null | ProductPurchase['uuid']
    hasTransaction: boolean
} = {
    hasTransaction: false,
    uuid: null,
}

export function productPurchaseToFormValues(
    productPurchase?: ProductPurchase,
): FormValuesType {
    return {
        cashable_uuid: productPurchase?.transaction?.cashable_uuid,
        costs: productPurchase?.product_movement?.costs,
        due: productPurchase?.due,
        note: productPurchase?.note,
        order: productPurchase?.order,
        paid: productPurchase?.paid,
        product_movement_details: productPurchase?.product_movement_details,
        received: productPurchase?.received,
        warehouse: productPurchase?.product_movement?.warehouse,
    }
}
