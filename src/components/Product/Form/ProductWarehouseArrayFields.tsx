// types

// materials
import Grid from '@mui/material/Grid'
import {
    FastField,
    type FieldArrayRenderProps,
    type FormikErrors,
} from 'formik'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// components
import NumericFormat from '@/components/NumericFormat'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import type Product from '@/modules/farm-inputs/types/orms/product'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function ProductWarehouseArrayFields({
    replace,
    data: warehouses,
    disabled,
    errors: warehouseErrors,
}: {
    data: Product['warehouses']
    disabled?: boolean
    errors?: string | string[] | FormikErrors<Product['warehouses']>
} & FieldArrayRenderProps) {
    return warehouses.map((warehouse, index) => {
        const errors =
            typeof warehouseErrors?.[index] === 'string'
                ? undefined
                : warehouseErrors?.[index]

        return (
            <Grid columnSpacing={1} container key={warehouse.warehouse}>
                <Grid size={2}>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={true}
                        label="Gudang"
                        name={`warehouses.${index}.warehouse`}
                        required={false}
                        variant="standard"
                    />
                </Grid>
                <Grid size={2}>
                    <NumericFormat
                        disabled={true}
                        label="QTY"
                        name="qty"
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    qty: floatValue,
                                }),
                            )
                        }
                        required={false}
                        value={warehouse.qty}
                        variant="standard"
                    />
                </Grid>
                <Grid size={4}>
                    <NumericFormat
                        disabled={true}
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                        }}
                        label="Biaya Dasar"
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    base_cost_rp_per_unit: floatValue,
                                }),
                            )
                        }
                        required={false}
                        value={warehouse.base_cost_rp_per_unit}
                        variant="standard"
                    />
                </Grid>
                <Grid size={4}>
                    <NumericFormat
                        disabled={disabled}
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                        }}
                        label="Harga Jual Default"
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    default_sell_price: floatValue,
                                }),
                            )
                        }
                        required={false}
                        value={warehouse.default_sell_price}
                        variant="standard"
                        {...errorsToHelperTextObj(errors?.default_sell_price)}
                    />
                </Grid>
            </Grid>
        )
    })
}
