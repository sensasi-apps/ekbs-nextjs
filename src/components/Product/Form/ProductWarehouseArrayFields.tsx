// types
import {
    FastField,
    type FieldArrayRenderProps,
    type FormikErrors,
} from 'formik'
import type Product from '@/dataTypes/Product'
// materials
import Grid from '@mui/material/Grid'
// components
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

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
            <Grid key={index} container columnSpacing={1}>
                <Grid size={2}>
                    <FastField
                        name={`warehouses.${index}.warehouse`}
                        label="Gudang"
                        component={TextFieldFastableComponent}
                        disabled={true}
                        required={false}
                        variant="standard"
                    />
                </Grid>
                <Grid size={2}>
                    <NumericFormat
                        disabled={true}
                        required={false}
                        label="QTY"
                        variant="standard"
                        value={warehouse.qty}
                        name="qty"
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    qty: floatValue,
                                }),
                            )
                        }
                    />
                </Grid>
                <Grid size={4}>
                    <NumericFormat
                        disabled={true}
                        required={false}
                        label="Biaya Dasar"
                        variant="standard"
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                        }}
                        value={warehouse.base_cost_rp_per_unit}
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    base_cost_rp_per_unit: floatValue,
                                }),
                            )
                        }
                    />
                </Grid>
                <Grid size={4}>
                    <NumericFormat
                        required={false}
                        disabled={disabled}
                        label="Harga Jual Default"
                        variant="standard"
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                        }}
                        value={warehouse.default_sell_price}
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    default_sell_price: floatValue,
                                }),
                            )
                        }
                        {...errorsToHelperTextObj(errors?.default_sell_price)}
                    />
                </Grid>
            </Grid>
        )
    })
}
