// types
import type ProductType from '@/dataTypes/Product'
// vendors
import { FieldArray } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
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

                    {product_sale_details?.map((row, index) => (
                        <Box display="flex" key={index} gap={1} mb={1.5}>
                            <Tooltip placement="top" arrow title="Hapus">
                                <span>
                                    <IconButton
                                        disabled={index === 0 || disabled}
                                        color="error"
                                        onClick={() => remove(index)}>
                                        <RemoveCircleIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>

                            <Grid2 container spacing={1}>
                                <Grid2
                                    xs={12}
                                    sm={8}
                                    display="flex"
                                    flexDirection="column"
                                    gap={1}>
                                    {isLoading ? (
                                        <Skeleton
                                            variant="rounded"
                                            height="2.5em"
                                        />
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
                                            value={
                                                products.find(
                                                    p =>
                                                        p.id === row.product_id,
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
                                                    margin="none"
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

                                    <Box>
                                        <Grid2 container spacing={1}>
                                            <Grid2 xs={12} sm={4}>
                                                <NumericFormat
                                                    min="1"
                                                    margin="none"
                                                    allowNegative
                                                    disabled={disabled}
                                                    label="Jumlah"
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
                                                    onValueChange={({
                                                        floatValue,
                                                    }) =>
                                                        debounce(() =>
                                                            replace(index, {
                                                                ...row,
                                                                qty: Math.abs(
                                                                    floatValue,
                                                                ),
                                                            }),
                                                        )
                                                    }
                                                    value={
                                                        row.qty
                                                            ? row.qty * -1
                                                            : ''
                                                    }
                                                    {...errorsToHelperTextObj(
                                                        errors[
                                                            `product_sale_details.${index}.qty`
                                                        ],
                                                    )}
                                                />
                                            </Grid2>

                                            <Grid2 xs={12} sm={8}>
                                                <NumericFormat
                                                    min="1"
                                                    margin="none"
                                                    disabled={disabled}
                                                    label="Harga"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <RpInputAdornment />
                                                        ),
                                                    }}
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
                                            </Grid2>
                                        </Grid2>
                                    </Box>
                                </Grid2>

                                <Grid2
                                    xs={12}
                                    sm={4}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '100%',
                                        },
                                    }}>
                                    <NumericFormat
                                        required={false}
                                        disabled
                                        allowNegative
                                        margin="none"
                                        label="Subtotal"
                                        sx={{
                                            height: '100%',
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                        }}
                                        value={
                                            row.qty && row.rp_per_unit
                                                ? row.qty * -1 * row.rp_per_unit
                                                : ''
                                        }
                                    />
                                </Grid2>
                            </Grid2>
                        </Box>
                    ))}

                    <Box display="flex" gap={2} justifyContent="end">
                        <Typography
                            variant="h6"
                            component="span"
                            fontWeight="bold"
                            color="gray">
                            TOTAL
                        </Typography>

                        <Typography
                            variant="h6"
                            component="span"
                            fontWeight="bold">
                            {numberToCurrency(
                                product_sale_details?.reduce(
                                    (acc, row) =>
                                        acc +
                                        (row.qty ?? 0) *
                                            -1 *
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
