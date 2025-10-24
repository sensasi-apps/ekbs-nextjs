// types

import AddCircleIcon from '@mui/icons-material/AddCircle'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// vendors
import { Field, type FieldArrayRenderProps, type FieldProps } from 'formik'
import useSWR from 'swr'
import ApiUrl from '@/app/mart-product-sales/_parts/enums/api-url'
// components
import NumericField from '@/components/formik-fields/numeric-field'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import type Product from '@/modules/mart/types/orms/product'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import formatNumber from '@/utils/format-number'
import type { FormValues } from '../form'

export default function ProductMovementDetailArrayFields({
    push,
    remove,
    name,
    form: { getFieldMeta },
    disabled,
}: FieldArrayRenderProps & {
    disabled: boolean
}) {
    const { value, error } = getFieldMeta<FormValues['details']>(name)

    return (
        <Box mb={4}>
            <Box alignItems="center" display="flex">
                <Typography>Daftar Barang</Typography>

                <IconButton
                    color="success"
                    disabled={disabled}
                    onClick={() => push({})}
                    size="small">
                    <AddCircleIcon />
                </IconButton>
            </Box>
            {error && JSON.stringify(error) !== '{}' && (
                <FormHelperText component="ul" error>
                    {Object.values(error)
                        .flatMap((v: string | object | Array<object>) =>
                            typeof v === 'string'
                                ? [v]
                                : Object.values(v).flatMap(v =>
                                      Object.values(v),
                                  ),
                        )
                        .filter(Boolean)
                        .map((v, i) => (
                            <Box component="li" key={i}>
                                {v as string}
                            </Box>
                        ))}
                </FormHelperText>
            )}
            {value?.map((detail, index: number) => {
                const subtotal =
                    detail.qty *
                    (detail.rp_per_unit + (detail.cost_rp_per_unit ?? 0))

                return (
                    <Grid
                        alignItems="center"
                        columnSpacing={1}
                        container
                        key={index}
                        mb={1}>
                        <Grid
                            component={Typography}
                            size={0.5}
                            variant="overline">
                            {index + 1}
                        </Grid>
                        <Grid container size={8.5}>
                            <Grid size={12}>
                                <ProductPicker
                                    disabled={disabled}
                                    name={`${name}.${index}.product`}
                                />
                            </Grid>

                            <Grid size={4}>
                                <NumericField
                                    disabled={disabled}
                                    label="Harga Satuan"
                                    name={`${name}.${index}.rp_per_unit`}
                                    numericFormatProps={{
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    /{detail.product?.unit}
                                                </InputAdornment>
                                            ),
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={4}>
                                <NumericField
                                    disabled={disabled}
                                    label="Biaya Satuan"
                                    name={`${name}.${index}.cost_rp_per_unit`}
                                    numericFormatProps={{
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    /{detail.product?.unit}
                                                </InputAdornment>
                                            ),
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                        },
                                        value: detail.cost_rp_per_unit,
                                    }}
                                />
                            </Grid>

                            <Grid size={4}>
                                <NumericField
                                    disabled={disabled}
                                    label="Qty"
                                    name={`${name}.${index}.qty`}
                                    numericFormatProps={{
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {detail.product?.unit}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid px={2} size={2.5}>
                            <Typography variant="overline">subtotal</Typography>

                            <Box
                                alignItems="center"
                                display="flex"
                                justifyContent="space-between">
                                <Box>Rp</Box>
                                <Box>
                                    {subtotal ? formatNumber(subtotal) : ''}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={0.5}>
                            <IconButton
                                color="error"
                                disabled={disabled}
                                onClick={() => remove(index)}
                                size="small"
                                tabIndex={-1}>
                                <RemoveCircleIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                )
            })}
            {value && <FooterGrids value={value} />}
        </Box>
    )
}

function ProductPicker({
    name,
    disabled,
}: {
    name: string
    disabled: boolean
}) {
    const { data: products, isLoading } = useSWR<{
        fetched_at: string
        data: (Product & {
            is_in_opname: boolean
        })[]
    }>(ApiUrl.PRODUCTS)

    return (
        <Field name={name}>
            {({
                field: { name },
                meta: { error, value },
                form: { setFieldValue },
            }: FieldProps) => (
                <Autocomplete<Product>
                    disabled={disabled}
                    getOptionDisabled={({ deleted_at }) => Boolean(deleted_at)}
                    getOptionLabel={({ id, barcode_reg_id, name }) =>
                        `${barcode_reg_id ?? id} - ${name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    loading={isLoading}
                    onChange={(_, product) => {
                        setFieldValue(name, product)
                        setFieldValue(name + '_id', product?.id)
                    }}
                    options={products?.data ?? []}
                    renderInput={params => (
                        <TextField
                            {...params}
                            disabled={disabled || isLoading || !products}
                            label="Produk"
                            margin="dense"
                            required
                            size="small"
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
                    renderOption={(
                        props,
                        { id, barcode_reg_id, name, deleted_at },
                    ) => {
                        return (
                            <li
                                {...props}
                                key={id}
                                style={{
                                    ...props.style,
                                    textDecoration: deleted_at
                                        ? 'line-through'
                                        : 'none',
                                }}>
                                {barcode_reg_id ?? id} - {name}
                            </li>
                        )
                    }}
                    value={value ?? null}
                />
            )}
        </Field>
    )
}

function FooterGrids({ value }: { value: FormValues['details'] }) {
    const totalCost =
        value?.reduce(
            (acc, { cost_rp_per_unit }) => acc + (cost_rp_per_unit ?? 0),
            0,
        ) ?? 0

    const purchaseRpTotal =
        (value?.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0) + totalCost

    return (
        <Grid alignItems="center" columnSpacing={1} container>
            <Grid size={9} textAlign="right">
                <Typography variant="overline">Total</Typography>
            </Grid>
            <Grid
                display="flex"
                justifyContent="space-between"
                px={2}
                size={2.5}
                textAlign="center">
                <Typography variant="overline">Rp</Typography>
                <Typography variant="overline">
                    {formatNumber(purchaseRpTotal)}
                </Typography>
            </Grid>
            <Grid size={0.5} />
        </Grid>
    )
}
