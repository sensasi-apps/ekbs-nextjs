// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { FieldArrayRenderProps, FormikErrors } from 'formik'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import RpInputAdornment from '@/components/input-adornments/rp'
// components
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/text-field'
import axios from '@/lib/axios'
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'
import type ProductType from '@/modules/farm-inputs/types/orms/product'
import type ProductMovementDetailORM from '@/modules/farm-inputs/types/orms/product-movement-detail'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import { type FormValuesType } from '../Form'

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
    data: ProductMovementDetailORM[]
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
            <Typography component="div" mb={0.5} mt={2} variant="h6">
                Daftar Barang
                <Tooltip arrow placement="top" title="Tambah">
                    <span>
                        <IconButton
                            color="success"
                            disabled={disabled}
                            onClick={() => {
                                push({})
                                setSubtotals([...subtotals, undefined])
                                setRpCosts([...rpCosts, undefined])
                            }}
                            size="small">
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip
                    arrow
                    placement="top"
                    title="Isi biaya lain secara otomatis">
                    <span>
                        <IconButton
                            color="warning"
                            disabled={disabled}
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
                            }}
                            size="small">
                            <AutoFixHighIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            {product_movement_details.map((row, index) => (
                <Grid
                    alignItems="center"
                    columnSpacing={1.5}
                    container
                    key={row.id}
                    sx={{
                        mb: {
                            sm: 'initial',
                            xs: 1.5,
                        },
                    }}>
                    <Grid
                        alignSelf="center"
                        size={{ sm: 1, xs: 2 }}
                        textAlign="center">
                        <Tooltip arrow placement="top" title="Hapus">
                            <span>
                                <IconButton
                                    color="error"
                                    disabled={index === 0 || disabled}
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
                                    }}
                                    size="small">
                                    <RemoveCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>

                    {/* QTY */}
                    <Grid
                        size={{
                            sm: 1.5,
                            xs: 10,
                        }}>
                        <NumericFormat
                            disabled={disabled}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {row.product?.unit}
                                    </InputAdornment>
                                ),
                            }}
                            label="Jumlah"
                            min="1"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        qty: floatValue,
                                        rp_cost_per_unit:
                                            (rpCosts[index] ?? 1) /
                                            (floatValue ?? 1),
                                        rp_per_unit: calculatePrice(
                                            floatValue,
                                            subtotals[index],
                                        ),
                                    }),
                                )
                            }
                            value={row.qty || ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[`product_movement_details.${index}.qty`],
                            )}
                        />
                    </Grid>

                    {/* PRODUCTS */}
                    <Grid
                        size={{
                            sm: 2.5,
                            xs: 12,
                        }}>
                        {isLoading ? (
                            <Skeleton variant="rounded" />
                        ) : (
                            <Autocomplete
                                disabled={disabled}
                                getOptionLabel={({ name, code }) =>
                                    `${code ? `${code} - ` : ''}${name}`
                                }
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                onChange={(_, product) =>
                                    replace(index, {
                                        ...row,
                                        product,
                                        product_id: product?.id,
                                    })
                                }
                                options={products}
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
                                value={row.product ?? row.product_state ?? null}
                            />
                        )}
                    </Grid>

                    {/* PRICE */}
                    <Grid
                        size={{
                            sm: 2.5,
                            xs: 12,
                        }}>
                        <NumericFormat
                            decimalScale={4}
                            disabled={true}
                            InputProps={{
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
                                startAdornment: <RpInputAdornment />,
                            }}
                            label="Harga Satuan"
                            min="1"
                            value={row.rp_per_unit || ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_per_unit`
                                ],
                            )}
                        />
                    </Grid>

                    {/* SUBTOTAL */}
                    <Grid
                        size={{
                            sm: 2.5,
                            xs: 12,
                        }}>
                        <NumericFormat
                            disabled={disabled}
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            label="Subtotal"
                            min="1"
                            name="subtotal"
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
                            value={subtotals[index] ?? ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_per_unit`
                                ],
                            )}
                        />
                    </Grid>

                    {/* OTHER COST */}
                    <Grid
                        size={{
                            sm: 2,
                            xs: 12,
                        }}>
                        <NumericFormat
                            decimalScale={4}
                            disabled={disabled}
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            label="Biaya Lain"
                            min="1"
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
                            value={rpCosts[index] ?? ''}
                            {...errorsToHelperTextObj(
                                // @ts-expect-error formix errors can't accomodate laravel 422 errors
                                errors[
                                    `product_movement_details.${index}.rp_cost_per_unit`
                                ],
                            )}
                        />
                    </Grid>
                </Grid>
            ))}
        </>
    )
}
