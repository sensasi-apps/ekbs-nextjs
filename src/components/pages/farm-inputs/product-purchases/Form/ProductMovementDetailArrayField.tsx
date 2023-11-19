// types
import type ProductType from '@/dataTypes/Product'
import ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
// vendors
import { FieldArray } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// components
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import numberToCurrency from '@/utils/numberToCurrency'

// eslint-disable-next-line import/no-unused-modules
const ProductMovementDetailArrayField = memo(
    function ProductMovementDetailArrayField({
        data: product_movement_details,
        disabled,
        errors,
    }: {
        data: ProductMovementDetailType[]
        disabled?: boolean
        errors: any // Laravel array of object validation errors is not supported by formik (?)
    }) {
        const { data: products = [], isLoading } = useSWR<ProductType[]>(
            '/farm-inputs/products/datatable',
            url => axios.get(url).then(res => res.data.data),
            { keepPreviousData: true },
        )

        return (
            <FieldArray
                name="product_movement_details"
                render={({ replace, pop, push }) => (
                    <>
                        <Typography variant="h6" component="h2" mt={2} mb={0.5}>
                            Daftar Produk
                        </Typography>

                        {product_movement_details.map((row, index) => (
                            <Grid
                                key={index}
                                mb={2}
                                container
                                columnSpacing={2}
                                rowSpacing={1}>
                                <Grid item xs={12} sm={2}>
                                    <NumericFormat
                                        min="1"
                                        disabled={disabled}
                                        label="Jumlah"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {row.product?.unit}
                                                </InputAdornment>
                                            ),
                                        }}
                                        onValueChange={({ floatValue }) =>
                                            debounce(() =>
                                                replace(index, {
                                                    ...row,
                                                    qty: floatValue || '',
                                                }),
                                            )
                                        }
                                        value={row.qty || ''}
                                        {...errorsToHelperTextObj(
                                            errors[
                                                `product_movement_details.${index}.qty`
                                            ],
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    {isLoading ? (
                                        <Skeleton height="100%" />
                                    ) : (
                                        <Autocomplete
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.id === value.id}
                                            options={products}
                                            disabled={disabled}
                                            getOptionLabel={(
                                                option: ProductType,
                                            ) =>
                                                `#${option.id} - ${option.name}`
                                            }
                                            value={row.product ?? null}
                                            onChange={(_, product) =>
                                                replace(index, {
                                                    ...row,
                                                    product_id: product?.id,
                                                    product,
                                                })
                                            }
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Produk"
                                                    {...errorsToHelperTextObj(
                                                        errors[
                                                            `product_movement_details.${index}.product_id`
                                                        ],
                                                    )}
                                                />
                                            )}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <NumericFormat
                                        min="1"
                                        disabled={disabled}
                                        label="Harga"
                                        InputProps={{
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {row.product?.unit
                                                        ? '/'
                                                        : ''}
                                                    {row.product?.unit}
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={row.rp_per_unit || ''}
                                        onValueChange={({ floatValue }) =>
                                            debounce(() =>
                                                replace(index, {
                                                    ...row,
                                                    rp_per_unit: floatValue,
                                                }),
                                            )
                                        }
                                        {...errorsToHelperTextObj(
                                            errors[
                                                `product_movement_details.${index}.rp_per_unit`
                                            ],
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <NumericFormat
                                        min="1"
                                        disabled={disabled}
                                        label="Total"
                                        name="total"
                                        InputProps={{
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                        }}
                                        value={
                                            (row.qty || 0) *
                                                (row.rp_per_unit || 0) || ''
                                        }
                                        onValueChange={({ floatValue }) =>
                                            debounce(() =>
                                                replace(index, {
                                                    ...row,
                                                    rp_per_unit: floatValue
                                                        ? Math.ceil(
                                                              floatValue /
                                                                  (row.qty ||
                                                                      0),
                                                          )
                                                        : undefined,
                                                }),
                                            )
                                        }
                                        {...errorsToHelperTextObj(
                                            errors[
                                                `product_movement_details.${index}.rp_per_unit`
                                            ],
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        ))}

                        <Grid container fontWeight="bold" fontSize="1.1rem">
                            <Grid item xs={9} textAlign="center">
                                TOTAL
                            </Grid>

                            <Grid item xs={3}>
                                {numberToCurrency(
                                    product_movement_details.reduce(
                                        (acc, cur) =>
                                            acc +
                                            (cur.qty || 0) *
                                                (cur.rp_per_unit || 0),
                                        0,
                                    ),
                                )}
                            </Grid>
                        </Grid>

                        <div
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                marginTop: '1rem',
                                marginBottom: '2rem',
                            }}>
                            <Button
                                disabled={disabled}
                                color="success"
                                variant="outlined"
                                size="small"
                                onClick={() => push({})}>
                                Tambah Produk
                            </Button>

                            <Button
                                disabled={
                                    disabled ||
                                    product_movement_details.length === 1
                                }
                                color="error"
                                size="small"
                                onClick={pop}>
                                Hapus Produk
                            </Button>
                        </div>
                    </>
                )}
            />
        )
    },
)

export default ProductMovementDetailArrayField
