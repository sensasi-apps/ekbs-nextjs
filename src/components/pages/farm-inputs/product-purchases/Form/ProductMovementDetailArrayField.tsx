// types
import type { FieldArrayRenderProps, FormikErrors } from 'formik'
import type ProductType from '@/dataTypes/Product'
import type ProductMovementDetail from '@/dataTypes/ProductMovementDetail'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Grid2 from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
// components
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import DatatableEndpointEnum from '@/types/farm-inputs/DatatableEndpointEnum'
import { FormValuesType } from '../Form'

const calculatePrice = (qty?: number, subtotal?: number) => {
    if (!qty || !subtotal) return undefined

    return subtotal / qty
}

export default function ProductMovementDetailArrayField({
    push,
    replace,
    remove,
    data: product_movement_details,
    disabled,
    errors,
    totalRpCost,
}: {
    data: ProductMovementDetail[]
    disabled?: boolean
    errors: FormikErrors<FormValuesType>
    totalRpCost: number
} & FieldArrayRenderProps) {
    const { data: products = [], isLoading } = useSWR<ProductType[]>(
        DatatableEndpointEnum.PRODUCTS,
        url => axios.get(url).then(res => res.data.data),
        {
            revalidateOnMount: true,
        },
    )

    const [subtotals, setSubtotals] = useState<(number | undefined)[]>(
        product_movement_details.map(pmd => pmd.qty * pmd.rp_per_unit),
    )

    const [rpCosts, setRpCosts] = useState<(number | undefined)[]>(
        product_movement_details.map(pmd => pmd.qty * pmd.rp_cost_per_unit),
    )

    return (
        <>
            <Typography variant="h6" component="div" mt={2} mb={0.5}>
                Daftar Barang
                <Tooltip placement="top" arrow title="Tambah">
                    <span>
                        <IconButton
                            disabled={disabled}
                            color="success"
                            size="small"
                            onClick={() => {
                                push({})
                                setSubtotals([...subtotals, undefined])
                                setRpCosts([...rpCosts, undefined])
                            }}>
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip
                    placement="top"
                    arrow
                    title="Isi biaya lain secara otomatis">
                    <span>
                        <IconButton
                            disabled={disabled}
                            color="warning"
                            size="small"
                            onClick={() => {
                                const rpCosts: number[] = []

                                product_movement_details.forEach(
                                    (pmd, index) => {
                                        const rpCost =
                                            totalRpCost /
                                            product_movement_details.length

                                        rpCosts.push(rpCost)

                                        replace(index, {
                                            ...pmd,
                                            rp_cost_per_unit: rpCost / pmd.qty,
                                        })
                                    },
                                )

                                setRpCosts(rpCosts)
                            }}>
                            <AutoFixHighIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            {product_movement_details.map((row, index) => (
                <Grid2
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
                    <Grid2 xs={2} sm={1} alignSelf="center" textAlign="center">
                        <Tooltip placement="top" arrow title="Hapus">
                            <span>
                                <IconButton
                                    disabled={index === 0 || disabled}
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        remove(index)
                                        setSubtotals(
                                            subtotals.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                        setRpCosts(
                                            rpCosts.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }}>
                                    <RemoveCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid2>

                    {/* QTY */}
                    <Grid2 xs={10} sm={1.5}>
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
                                        rp_per_unit: calculatePrice(
                                            floatValue,
                                            subtotals[index],
                                        ),
                                        rp_cost_per_unit:
                                            (rpCosts[index] ?? 1) /
                                            (floatValue ?? 1),
                                    }),
                                )
                            }
                            value={row.qty || ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[`product_movement_details.${index}.qty`],
                            )}
                        />
                    </Grid2>

                    {/* PRODUCTS */}
                    <Grid2 xs={12} sm={2.5}>
                        {isLoading ? (
                            <Skeleton variant="rounded" />
                        ) : (
                            <Autocomplete
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                options={products}
                                disabled={disabled}
                                getOptionLabel={({ name, code }) =>
                                    `${code ? `${code} - ` : ''}${name}`
                                }
                                value={row.product ?? row.product_state ?? null}
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
                                            // @ts-expect-error formix errors can't accomodate laravel 422 errors

                                            errors[
                                                `product_movement_details.${index}.product_id`
                                            ],
                                        )}
                                    />
                                )}
                            />
                        )}
                    </Grid2>

                    {/* PRICE */}
                    <Grid2 xs={12} sm={2.5}>
                        <NumericFormat
                            decimalScale={4}
                            min="1"
                            disabled={true}
                            label="Harga Satuan"
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        style={{
                                            color: 'inherit',
                                        }}>
                                        {row.product?.unit
                                            ? `/${row.product?.unit}`
                                            : ''}
                                    </InputAdornment>
                                ),
                            }}
                            value={row.rp_per_unit || ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_per_unit`
                                ],
                            )}
                        />
                    </Grid2>

                    {/* SUBTOTAL */}
                    <Grid2 xs={12} sm={2.5}>
                        <NumericFormat
                            min="1"
                            disabled={disabled}
                            label="Subtotal"
                            name="subtotal"
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            value={subtotals[index] ?? ''}
                            onValueChange={({ floatValue }) =>
                                debounce(() => {
                                    setSubtotals(old => {
                                        const subtotals = [...old]

                                        subtotals[index] = floatValue

                                        return subtotals
                                    })

                                    replace(index, {
                                        ...row,
                                        rp_per_unit: calculatePrice(
                                            row.qty,
                                            floatValue,
                                        ),
                                    })
                                })
                            }
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_per_unit`
                                ],
                            )}
                        />
                    </Grid2>

                    {/* OTHER COST */}
                    <Grid2 xs={12} sm={2}>
                        <NumericFormat
                            decimalScale={4}
                            min="1"
                            disabled={disabled}
                            label="Biaya Lain"
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            value={rpCosts[index] ?? ''}
                            onValueChange={({ floatValue }) => {
                                setRpCosts(old => {
                                    const rpCosts = [...old]

                                    rpCosts[index] = floatValue

                                    return rpCosts
                                })

                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        rp_cost_per_unit:
                                            row.qty && floatValue
                                                ? floatValue / row.qty
                                                : 0,
                                    }),
                                )
                            }}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_cost_per_unit`
                                ],
                            )}
                        />
                    </Grid2>
                </Grid2>
            ))}
        </>
    )
}
