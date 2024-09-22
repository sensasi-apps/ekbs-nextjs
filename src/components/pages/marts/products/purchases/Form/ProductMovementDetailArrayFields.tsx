// types
import type { FormValues } from '../Form'
import type Product from '@/dataTypes/mart/Product'
// vendors
import { Field, FieldArrayRenderProps, FieldProps } from 'formik'
// materials
import {
    Autocomplete,
    Box,
    FormHelperText,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
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

    const { data: products, isLoading } = useSWR<Product[]>(
        'data/marts/products',
    )

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
            <FormHelperText error>{error}</FormHelperText>

            {value && <HeaderGrids />}

            {value?.map((detail, index: number) => {
                const subtotal =
                    detail.qty *
                    (detail.rp_per_unit + (detail.cost_rp_per_unit ?? 0))

                return (
                    <Grid2
                        container
                        columnSpacing={1}
                        alignItems="center"
                        key={index}>
                        <Grid2
                            xs={0.5}
                            component={Typography}
                            variant="overline">
                            {index + 1}
                        </Grid2>

                        <Grid2 xs={3}>
                            <Field name={`${name}.${index}.product`}>
                                {({
                                    field: { name },
                                    meta: { error, value },
                                    form: { setFieldValue },
                                }: FieldProps) => (
                                    <Autocomplete<Product>
                                        isOptionEqualToValue={(option, value) =>
                                            option.id === value.id
                                        }
                                        options={products ?? []}
                                        disabled={disabled}
                                        getOptionLabel={({ id, code, name }) =>
                                            `${code ?? id} - ${name}`
                                        }
                                        value={value ?? null}
                                        onChange={(_, product) => {
                                            setFieldValue(name, product)
                                            setFieldValue(
                                                name + '_id',
                                                product?.id,
                                            )
                                        }}
                                        loading={isLoading}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                margin="dense"
                                                required
                                                disabled={
                                                    disabled ||
                                                    isLoading ||
                                                    !products
                                                }
                                                {...errorsToHelperTextObj(
                                                    error,
                                                )}
                                            />
                                        )}
                                    />
                                )}
                            </Field>
                        </Grid2>

                        <Grid2 xs={2}>
                            <NumericField
                                disabled={disabled}
                                name={`${name}.${index}.rp_per_unit`}
                                numericFormatProps={{
                                    InputProps: {
                                        startAdornment: <RpInputAdornment />,
                                    },
                                }}
                            />
                        </Grid2>

                        <Grid2 xs={2}>
                            <NumericField
                                disabled={disabled}
                                name={`${name}.${index}.cost_rp_total`}
                                numericFormatProps={{
                                    InputProps: {
                                        startAdornment: <RpInputAdornment />,
                                    },
                                    value: detail.cost_rp_per_unit,
                                }}
                            />
                        </Grid2>

                        <Grid2 xs={1.5}>
                            <NumericField
                                disabled={disabled}
                                name={`${name}.${index}.qty`}
                            />
                        </Grid2>

                        <Grid2
                            xs={2.5}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={2}>
                            <Box>Rp</Box>
                            <Box>{subtotal ? formatNumber(subtotal) : ''}</Box>
                        </Grid2>

                        <Grid2 xs={0.5}>
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

function HeaderGrids() {
    return (
        <Grid2 container columnSpacing={1} alignItems="center">
            <Grid2 xs={0.5} />

            <Grid2 xs={3} textAlign="center">
                <Typography variant="overline">Barang</Typography>
            </Grid2>

            <Grid2 xs={2} textAlign="center">
                <Typography variant="overline">Harga Satuan</Typography>
            </Grid2>

            <Grid2 xs={2} textAlign="center">
                <Typography variant="overline">Biaya Satuan</Typography>
            </Grid2>

            <Grid2 xs={1.5} textAlign="center">
                <Typography variant="overline">Qty</Typography>
            </Grid2>

            <Grid2 xs={2.5} textAlign="center">
                <Typography variant="overline">Subtotal</Typography>
            </Grid2>

            <Grid2 xs={0.5} textAlign="center" />
        </Grid2>
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
            <Grid2 xs={9} textAlign="right">
                <Typography variant="overline">Total</Typography>
            </Grid2>

            <Grid2
                xs={2.5}
                textAlign="center"
                display="flex"
                justifyContent="space-between"
                px={2}>
                <Typography variant="overline">Rp</Typography>
                <Typography variant="overline">
                    {formatNumber(purchaseRpTotal)}
                </Typography>
            </Grid2>

            <Grid2 xs={0.5} />
        </Grid2>
    )
}
