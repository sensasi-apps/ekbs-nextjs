// types
import type { FormValues } from '../Form'
import type Product from '@/dataTypes/mart/Product'
// vendors
import { Field, type FieldArrayRenderProps, type FieldProps } from 'formik'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid'
// components
import { NumericField } from '@/components/FormikForm'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
// utils
import formatNumber from '@/utils/formatNumber'
import useSWR from 'swr'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import ApiUrl from '../../sales/@enums/api-url'

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
            <Box display="flex" alignItems="center">
                <Typography>Daftar Barang</Typography>

                <IconButton
                    size="small"
                    color="success"
                    disabled={disabled}
                    onClick={() => push({})}>
                    <AddCircleIcon />
                </IconButton>
            </Box>
            {error && JSON.stringify(error) !== '{}' && (
                <FormHelperText error component="ul">
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
                    <Grid2
                        container
                        columnSpacing={1}
                        alignItems="center"
                        mb={1}
                        key={index}>
                        <Grid2
                            component={Typography}
                            variant="overline"
                            size={0.5}>
                            {index + 1}
                        </Grid2>
                        <Grid2 container size={8.5}>
                            <Grid2 size={12}>
                                <ProductPicker
                                    name={`${name}.${index}.product`}
                                    disabled={disabled}
                                />
                            </Grid2>

                            <Grid2 size={4}>
                                <NumericField
                                    label="Harga Satuan"
                                    disabled={disabled}
                                    name={`${name}.${index}.rp_per_unit`}
                                    numericFormatProps={{
                                        InputProps: {
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    /{detail.product?.unit}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Grid2>

                            <Grid2 size={4}>
                                <NumericField
                                    label="Biaya Satuan"
                                    disabled={disabled}
                                    name={`${name}.${index}.cost_rp_per_unit`}
                                    numericFormatProps={{
                                        InputProps: {
                                            startAdornment: (
                                                <RpInputAdornment />
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    /{detail.product?.unit}
                                                </InputAdornment>
                                            ),
                                        },
                                        value: detail.cost_rp_per_unit,
                                    }}
                                />
                            </Grid2>

                            <Grid2 size={4}>
                                <NumericField
                                    label="Qty"
                                    disabled={disabled}
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
                            </Grid2>
                        </Grid2>
                        <Grid2 px={2} size={2.5}>
                            <Typography variant="overline">subtotal</Typography>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center">
                                <Box>Rp</Box>
                                <Box>
                                    {subtotal ? formatNumber(subtotal) : ''}
                                </Box>
                            </Box>
                        </Grid2>
                        <Grid2 size={0.5}>
                            <IconButton
                                tabIndex={-1}
                                onClick={() => remove(index)}
                                size="small"
                                disabled={disabled}
                                color="error">
                                <RemoveCircleIcon />
                            </IconButton>
                        </Grid2>
                    </Grid2>
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
                    getOptionDisabled={({ deleted_at }) => Boolean(deleted_at)}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    options={products?.data ?? []}
                    disabled={disabled}
                    getOptionLabel={({ id, barcode_reg_id, name }) =>
                        `${barcode_reg_id ?? id} - ${name}`
                    }
                    value={value ?? null}
                    onChange={(_, product) => {
                        setFieldValue(name, product)
                        setFieldValue(name + '_id', product?.id)
                    }}
                    loading={isLoading}
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
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Produk"
                            size="small"
                            margin="dense"
                            required
                            disabled={disabled || isLoading || !products}
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
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
        <Grid2 container columnSpacing={1} alignItems="center">
            <Grid2 textAlign="right" size={9}>
                <Typography variant="overline">Total</Typography>
            </Grid2>
            <Grid2
                textAlign="center"
                display="flex"
                justifyContent="space-between"
                px={2}
                size={2.5}>
                <Typography variant="overline">Rp</Typography>
                <Typography variant="overline">
                    {formatNumber(purchaseRpTotal)}
                </Typography>
            </Grid2>
            <Grid2 size={0.5} />
        </Grid2>
    )
}
