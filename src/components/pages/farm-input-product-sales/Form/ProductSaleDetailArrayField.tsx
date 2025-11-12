// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// vendors
import { FieldArray } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// components
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import axios from '@/lib/axios'
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type Product from '@/modules/farm-inputs/types/orms/product'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
import { EMPTY_FORM_DATA } from '../Form'

const ProductSaleDetailArrayField = memo(function ProductSaleDetailArrayField({
    warehouse,
    data: product_sale_details,
    disabled,
    errors,
}: {
    warehouse?: Warehouse
    data: typeof EMPTY_FORM_DATA.product_sale_details
    disabled?: boolean
    errors: Record<string, string>
}) {
    const { data: products = [], isLoading } = useSWR<Product[]>(
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
                    <Typography component="div" mb={0.5} mt={2} variant="h6">
                        Daftar Barang
                        <Tooltip arrow placement="top" title="Tambah">
                            <span>
                                <IconButton
                                    color="success"
                                    disabled={disabled}
                                    onClick={() => push({})}
                                    size="small">
                                    <AddCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Typography>

                    {product_sale_details?.map((row, index) => (
                        <Box
                            display="flex"
                            gap={1}
                            key={row.product_id}
                            mb={1.5}>
                            <Tooltip arrow placement="top" title="Hapus">
                                <span>
                                    <IconButton
                                        color="error"
                                        disabled={index === 0 || disabled}
                                        onClick={() => remove(index)}>
                                        <RemoveCircleIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>

                            <Grid container spacing={1}>
                                <Grid
                                    display="flex"
                                    flexDirection="column"
                                    gap={1}
                                    size={{
                                        sm: 8,
                                        xs: 12,
                                    }}>
                                    {isLoading ? (
                                        <Skeleton
                                            height="2.5em"
                                            variant="rounded"
                                        />
                                    ) : (
                                        <Autocomplete
                                            disabled={disabled}
                                            getOptionLabel={(option: Product) =>
                                                `#${option.id} - ${option.name}`
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.id === value.id}
                                            onChange={(_, product) => {
                                                const rp_per_unit = warehouse
                                                    ? product?.warehouses.find(
                                                          w =>
                                                              w.warehouse ===
                                                              warehouse,
                                                      )?.default_sell_price
                                                    : undefined

                                                replace(index, {
                                                    ...row,
                                                    product,
                                                    product_id: product?.id,
                                                    rp_per_unit: rp_per_unit,
                                                })
                                            }}
                                            options={products}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Nama Barang"
                                                    margin="none"
                                                    {...errorsToHelperTextObj(
                                                        errors[
                                                            `product_sale_details.${index}.product_id`
                                                        ],
                                                    )}
                                                />
                                            )}
                                            value={
                                                products.find(
                                                    p =>
                                                        p.id === row.product_id,
                                                ) ?? null
                                            }
                                        />
                                    )}

                                    <Box>
                                        <Grid container spacing={1}>
                                            <Grid
                                                size={{
                                                    sm: 4,
                                                    xs: 12,
                                                }}>
                                                <NumericFormat
                                                    allowNegative
                                                    disabled={disabled}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                {
                                                                    row.product
                                                                        ?.unit
                                                                }
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    label="Jumlah"
                                                    margin="none"
                                                    min="1"
                                                    onValueChange={({
                                                        floatValue,
                                                    }) =>
                                                        debounce(() =>
                                                            replace(index, {
                                                                ...row,
                                                                qty: Math.abs(
                                                                    floatValue ??
                                                                        0,
                                                                ),
                                                            }),
                                                        )
                                                    }
                                                    value={
                                                        row.qty
                                                            ? Math.abs(row.qty)
                                                            : ''
                                                    }
                                                    {...errorsToHelperTextObj(
                                                        errors[
                                                            `product_sale_details.${index}.qty`
                                                        ],
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                size={{
                                                    sm: 4,
                                                    xs: 12,
                                                }}>
                                                <NumericFormat
                                                    disabled={disabled}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <RpInputAdornment />
                                                        ),
                                                    }}
                                                    label="Harga"
                                                    margin="none"
                                                    min="1"
                                                    onValueChange={({
                                                        floatValue,
                                                    }) =>
                                                        debounce(() =>
                                                            replace(index, {
                                                                ...row,
                                                                rp_per_unit:
                                                                    floatValue,
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
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid
                                    size={{
                                        sm: 4,
                                        xs: 12,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '100%',
                                        },
                                    }}>
                                    <NumericFormat
                                        allowNegative
                                        disabled
                                        InputProps={{
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                        }}
                                        label="Subtotal"
                                        margin="none"
                                        required={false}
                                        sx={{
                                            height: '100%',
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
                        </Box>
                    ))}

                    <Box display="flex" gap={2} justifyContent="end">
                        <Typography
                            color="gray"
                            component="span"
                            fontWeight="bold"
                            variant="h6">
                            TOTAL
                        </Typography>

                        <Typography
                            component="span"
                            fontWeight="bold"
                            variant="h6">
                            {numberToCurrency(
                                product_sale_details?.reduce(
                                    (acc, row) =>
                                        acc +
                                        Math.abs(row.qty ?? 0) *
                                            (row.rp_per_unit ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </Typography>
                    </Box>
                </>
            )}
        />
    )
})

export default ProductSaleDetailArrayField
