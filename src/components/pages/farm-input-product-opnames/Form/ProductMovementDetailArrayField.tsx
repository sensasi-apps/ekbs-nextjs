// types
import type ProductType from '@/modules/farm-inputs/types/orms/product'
// vendors
import { FieldArray, type FormikErrors } from 'formik'
import { memo } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/GridLegacy'
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
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import { EMPTY_FORM_DATA } from '../Form'
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'

const ProductMovementDetailArrayField = memo(
    function ProductMovementDetailArrayField({
        data: product_opname_movement_details,
        disabled,
        errors,
    }: {
        data: typeof EMPTY_FORM_DATA.product_opname_movement_details
        disabled?: boolean
        errors: FormikErrors<
            (typeof EMPTY_FORM_DATA)['product_opname_movement_details']
        >
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
                name="product_opname_movement_details"
                render={({ replace, push, remove }) => (
                    <>
                        <Typography
                            variant="h6"
                            component="div"
                            mt={2}
                            mb={0.5}>
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

                        {product_opname_movement_details.map((row, index) => (
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
                                    <Tooltip
                                        placement="top"
                                        arrow
                                        title="Hapus">
                                        <span>
                                            <IconButton
                                                disabled={
                                                    index === 0 || disabled
                                                }
                                                color="error"
                                                size="small"
                                                onClick={() => remove(index)}>
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={10} sm={5}>
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
                                                    label="Nama Barang"
                                                    {...errorsToHelperTextObj(
                                                        errors[index]
                                                            ?.product_id,
                                                    )}
                                                />
                                            )}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <NumericFormat
                                        min="1"
                                        disabled={true}
                                        label="Jumlah Sistem"
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
                                        value={
                                            // TODO: should defined warehouse to get the exact qty
                                            row.product_warehouse_state.qty ??
                                            ''
                                        }
                                        {...errorsToHelperTextObj(
                                            errors[index]?.qty,
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <NumericFormat
                                        min="1"
                                        disabled={disabled}
                                        label="Jumlah Fisik"
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
                                                    physical_qty:
                                                        floatValue || '',
                                                }),
                                            )
                                        }
                                        value={row.physical_qty || ''}
                                        {...errorsToHelperTextObj(
                                            errors[index]?.qty,
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </>
                )}
            />
        )
    },
)

export default ProductMovementDetailArrayField
