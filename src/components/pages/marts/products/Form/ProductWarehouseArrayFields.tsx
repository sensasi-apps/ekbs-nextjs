// types
import type Product from '@/dataTypes/mart/Product'
// vendors
import { FastField, type FieldArrayRenderProps } from 'formik'
// materials
import Grid2 from '@mui/material/Grid2'
// components
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

export default function ProductWarehouseArrayFields({
    replace,
    form: { values, errors },
    disabled,
}: FieldArrayRenderProps & { disabled: boolean }) {
    return (values?.warehouses ?? []).map(
        (warehouse: Product['warehouses'][0], index: number) => (
            <Grid2 key={index} container columnSpacing={1}>
                <Grid2 size={{ xs: 2 }}>
                    <FastField
                        name={`warehouses.${index}.warehouse`}
                        label="Gudang"
                        component={TextFieldFastableComponent}
                        disabled={true}
                        required={false}
                        variant="standard"
                    />
                </Grid2>

                <Grid2 size={{ xs: 2 }}>
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
                </Grid2>

                <Grid2 size={{ xs: 4 }}>
                    <NumericFormat
                        disabled={true}
                        required={false}
                        label="Biaya Dasar"
                        variant="standard"
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                        }}
                        value={warehouse.cost_rp_per_unit}
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                replace(index, {
                                    ...warehouse,
                                    base_cost_rp_per_unit: floatValue,
                                }),
                            )
                        }
                    />
                </Grid2>

                <Grid2 size={{ xs: 4 }}>
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
                </Grid2>
            </Grid2>
        ),
    )
}
