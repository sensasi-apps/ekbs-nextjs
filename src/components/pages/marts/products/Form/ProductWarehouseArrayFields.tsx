// types

// materials
import Grid from '@mui/material/Grid'
// vendors
import { FastField, type FieldArrayRenderProps } from 'formik'
import RpInputAdornment from '@/components/input-adornments/rp'
// components
import NumericFormat from '@/components/numeric-format'
import TextFieldFastableComponent from '@/components/text-field.fastable-component'
import type Product from '@/modules/mart/types/orms/product'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function ProductWarehouseArrayFields({
    replace,
    form: { values, errors },
    disabled,
}: FieldArrayRenderProps & { disabled: boolean }) {
    return (values?.warehouses ?? []).map(
        (warehouse: Product['warehouses'][0], index: number) => (
            <Grid columnSpacing={1} container key={warehouse.warehouse}>
                <Grid size={{ xs: 2 }}>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={true}
                        label="Gudang"
                        name={`warehouses.${index}.warehouse`}
                        required={false}
                        variant="standard"
                    />
                </Grid>

                <Grid size={{ xs: 2 }}>
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

                <Grid size={{ xs: 4 }}>
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
                        value={warehouse.cost_rp_per_unit}
                        variant="standard"
                    />
                </Grid>

                <Grid size={{ xs: 4 }}>
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
        ),
    )
}
