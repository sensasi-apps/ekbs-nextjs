// types
import type ProductType from '@/dataTypes/Product'
// vendors
import { FieldArray } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import { EMPTY_FORM_DATA } from '../Form'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import numberToCurrency from '@/utils/numberToCurrency'
import DatatableEndpointEnum from '@/types/farm-inputs/DatatableEndpointEnum'

const ProductSaleDetailArrayField = memo(function ProductSaleDetailArrayField({
    data: product_sale_details,
    disabled,
    errors,
}: {
    data: typeof EMPTY_FORM_DATA.product_sale_details
    disabled?: boolean
    errors: any // Laravel array of object validation errors is not supported by formik (?)
}) {
    const { data: products = [], isLoading } = useSWR<ProductType[]>(
        DatatableEndpointEnum.PRODUCTS,
        url => axios.get(url).then(res => res.data.data),
        {
            revalidateOnMount: true,
        },
    )

    return (
        <FieldArray
            name="product_sale_details"
            render={({ replace, push, remove }) => (
                <>
                    <Typography variant="h6" component="div" mt={2} mb={0.5}>
                        Daftar Barang
                        <Tooltip placement="top" arrow title="Tambah">
                            <span>
                                <IconButton
                                    disabled={disabled}
                                    color="success"
                                    size="small"
                                    onClick={() => push({})}>
                                    <AddCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Typography>

                    {product_sale_details.map((row, index) => (
                        <Grid
                            key={index}
                            container
                            columnSpacing={1.5}
                            alignItems="center"
                            sx={{
                                mb: {
                                    xs: 1.5,
                                    sm: 'initial',
                                },
                            }}>
                            <Grid
                                item
                                xs={2}
                                sm={1}
                                alignSelf="center"
                                textAlign="center">
                                <Tooltip placement="top" arrow title="Hapus">
                                    <span>
                                        <IconButton
                                            disabled={index === 0 || disabled}
                                            color="error"
                                            size="small"
                                            onClick={() => remove(index)}>
                                            <RemoveCircleIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={10} sm={2}>
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
                                                qty: floatValue,
                                            }),
                                        )
                                    }
                                    value={row.qty}
                                    {...errorsToHelperTextObj(
                                        errors[
                                            `product_sale_details.${index}.qty`
                                        ],
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {isLoading ? (
                                    <Skeleton height="100%" />
                                ) : (
                                    <Autocomplete
                                        isOptionEqualToValue={(option, value) =>
                                            option.id === value.id
                                        }
                                        options={products}
                                        disabled={disabled}
                                        getOptionLabel={(option: ProductType) =>
                                            `#${option.id} - ${option.name}`
                                        }
                                        value={
                                            products.find(
                                                p => p.id === row.product_id,
                                            ) ?? null
                                        }
                                        onChange={(_, product) =>
                                            replace(index, {
                                                ...row,
                                                rp_per_unit:
                                                    product?.default_sell_price,
                                                product_id: product?.id,
                                                product,
                                            })
                                        }
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Nama Barang"
                                                {...errorsToHelperTextObj(
                                                    errors[
                                                        `product_sale_details.${index}.product_id`
                                                    ],
                                                )}
                                            />
                                        )}
                                    />
                                )}
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <NumericFormat
                                    min="1"
                                    disabled={disabled}
                                    label="Harga"
                                    InputProps={{
                                        startAdornment: <RpInputAdornment />,
                                    }}
                                    onValueChange={({ floatValue }) =>
                                        debounce(() =>
                                            replace(index, {
                                                ...row,
                                                rp_per_unit: floatValue,
                                            }),
                                        )
                                    }
                                    value={row.rp_per_unit}
                                    {...errorsToHelperTextObj(
                                        errors[
                                            `product_sale_details.${index}.rp_per_unit`
                                        ],
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    required={false}
                                    disabled={true}
                                    label="Subtotal"
                                    InputProps={{
                                        startAdornment: <RpInputAdornment />,
                                    }}
                                    value={
                                        row.qty && row.rp_per_unit
                                            ? Math.abs(row.qty) *
                                              row.rp_per_unit
                                            : ''
                                    }
                                />
                            </Grid>
                        </Grid>
                    ))}

                    <Grid container columnSpacing={1.5}>
                        <Grid item xs={9} textAlign="end">
                            <Typography
                                variant="h6"
                                component="span"
                                fontWeight="bold"
                                color="gray">
                                TOTAL
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography
                                variant="h6"
                                component="span"
                                fontWeight="bold">
                                {numberToCurrency(
                                    product_sale_details.reduce(
                                        (acc, row) =>
                                            acc +
                                            Math.abs(row.qty ?? 0) *
                                                (row.rp_per_unit ?? 0),
                                        0,
                                    ) ?? '',
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                </>
            )}
        />
    )
})

export default ProductSaleDetailArrayField
