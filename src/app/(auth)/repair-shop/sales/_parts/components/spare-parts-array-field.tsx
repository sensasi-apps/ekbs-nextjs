// types
import { Field, FieldArray, useFormikContext, type FieldProps } from 'formik'
// vendors
import { useRef } from 'react'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// utils
import numberToCurrency from '@/utils/number-to-currency'
// component
import FlexBox from '@/components/flex-box'
import NumericField from '@/components/formik-fields/numeric-field'
import RemoveButton from '@/components/remove-button'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// modules
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'
import type SparePart from '@/app/(auth)/repair-shop/spare-parts/_types/spare-part-model'

export default function SparePartsArrayField({
    name,
    isDisabled,
}: {
    name: string
    isDisabled: boolean
}) {
    const {
        values: { spare_parts, payment_method },
    } = useFormikContext<SaleFormValues>()

    return (
        <FieldArray name={name}>
            {({ push, remove, form: { setFieldValue } }) => {
                return (
                    <>
                        <Box display="flex" gap={2} alignItems="center" mb={2}>
                            <Typography fontWeight="bold" component="div">
                                Suku Cadang
                            </Typography>

                            <AddItemButton
                                isDisabled={isDisabled}
                                push={push}
                            />
                        </Box>

                        <FlexBox flexDirection="column" gap={3}>
                            {spare_parts?.map((row, index) => (
                                <Grid
                                    key={index}
                                    container
                                    spacing={1}
                                    display="flex"
                                    alignItems="center"
                                    width="100%">
                                    <Grid
                                        size={{ xs: 2, sm: 1 }}
                                        textAlign="right"
                                        pr={1}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                        <NumberCell
                                            index={index}
                                            remove={remove}
                                            isDisabled={isDisabled}
                                            showDelete={
                                                index === spare_parts.length - 1
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 10,
                                            sm: 1.5,
                                        }}>
                                        <QtyInput
                                            isDisabled={isDisabled}
                                            name={`${name}.${index}.qty`}
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 7,
                                        }}
                                        display="flex"
                                        flexDirection="column"
                                        gap={1}>
                                        <SparePartInput
                                            name={`${name}.${index}.spare_part_warehouse_id`}
                                            isDisabled={isDisabled}
                                            onChange={(_, selected) => {
                                                setFieldValue(
                                                    `${name}.${index}`,
                                                    {
                                                        spare_part_warehouse_id:
                                                            selected?.spare_part_warehouse_id,
                                                        rp_per_unit:
                                                            selected?.default_sell_price,
                                                    },
                                                )

                                                setFieldValue(
                                                    `spare_part_margins.${index}`,
                                                    {
                                                        spare_part_warehouse_id:
                                                            selected?.spare_part_warehouse_id,
                                                        margin_percentage:
                                                            selected?.default_installment_margin_percentage,
                                                    },
                                                )
                                            }}
                                            state={row.spare_part_state}
                                        />

                                        <NumericField
                                            name={`${name}.${index}.rp_per_unit`}
                                            disabled={isDisabled}
                                            label="Harga satuan"
                                            numericFormatProps={{
                                                margin: 'none',
                                                slotProps: {
                                                    input: {
                                                        startAdornment: (
                                                            <RpInputAdornment />
                                                        ),
                                                    },
                                                },
                                            }}
                                        />

                                        {payment_method === 'installment' && (
                                            <NumericField
                                                name={`spare_part_margins.${index}.margin_percentage`}
                                                disabled={isDisabled}
                                                label="Marjin Angsuran"
                                                numericFormatProps={{
                                                    margin: 'none',
                                                    slotProps: {
                                                        input: {
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    %
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 2.5,
                                        }}>
                                        <SubTotal index={index} />
                                    </Grid>
                                </Grid>
                            ))}
                        </FlexBox>
                    </>
                )
            }}
        </FieldArray>
    )
}

function AddItemButton({
    isDisabled,
    push,
}: {
    isDisabled: boolean
    push: (obj: object) => void
}) {
    const nRow = useRef(1)

    return (
        <Box display="flex" alignItems="center" mt={1}>
            <MuiTextField
                disabled={isDisabled}
                fullWidth={false}
                size="small"
                type="number"
                defaultValue={1}
                label="Tambah baris"
                slotProps={{ input: { inputProps: { min: 1, max: 99 } } }}
                sx={{
                    maxWidth: '4em',
                }}
                onChange={e => (nRow.current = Number(e.target.value))}
            />

            <Tooltip placement="top" arrow title="Tambah">
                <span>
                    <IconButton
                        disabled={isDisabled}
                        color="success"
                        size="small"
                        onClick={() => {
                            for (let i = 0; i < nRow.current; i++) {
                                push({})
                            }
                        }}>
                        <AddCircleIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}

interface SparePartForSale {
    default_sell_price: number
    default_installment_margin_percentage: number
    qty: number
    name: string
    spare_part_warehouse_id: number
    spare_part_id: number
}

function SparePartInput({
    name,
    state,
    isDisabled,
    onChange,
}: {
    name: string
    isDisabled: boolean
    state: SparePart | undefined
    onChange: (
        event: React.SyntheticEvent,
        selected: SparePartForSale | null,
    ) => void
}) {
    const { data: spareParts = [], isLoading } = useSWR<SparePartForSale[]>(
        !state ? 'repair-shop/sales/get-spare-part-warehouses' : null,
        null,
        {
            keepPreviousData: false,
        },
    )

    if (state) {
        return `${state.id} — ${state.name}`
    }

    if (isLoading) {
        return <Skeleton variant="rounded" />
    }

    return (
        <Field name={name}>
            {({ field, meta: { error } }: FieldProps<number, FormData>) => {
                const selectedValue =
                    spareParts.find(
                        sparePart =>
                            sparePart.spare_part_warehouse_id === field.value,
                    ) ?? null

                return (
                    <Autocomplete
                        isOptionEqualToValue={(option, value) =>
                            option.spare_part_warehouse_id ===
                            value.spare_part_id
                        }
                        id={field.name}
                        value={selectedValue}
                        options={spareParts}
                        getOptionDisabled={sparePart => sparePart.qty <= 0}
                        disabled={isDisabled}
                        getOptionLabel={sparePart =>
                            `${sparePart.spare_part_id} — ${sparePart.name}`
                        }
                        onChange={onChange}
                        renderInput={params => (
                            <MuiTextField
                                {...params}
                                required
                                label="Suku Cadang"
                                size="small"
                                margin="none"
                                error={Boolean(error)}
                                helperText={error}
                            />
                        )}
                    />
                )
            }}
        </Field>
    )
}

function NumberCell({
    isDisabled,
    index,
    remove,
    showDelete,
}: {
    isDisabled: boolean
    index: number
    remove: (index: number) => void
    showDelete: boolean
}) {
    if (!showDelete) return index + 1

    return (
        <>
            <RemoveButton
                onClick={() => remove(index)}
                isDisabled={isDisabled}
            />

            {index + 1}
        </>
    )
}

function QtyInput({ name, isDisabled }: { name: string; isDisabled: boolean }) {
    return (
        <NumericField
            name={name}
            disabled={isDisabled}
            label="Jumlah"
            numericFormatProps={{
                margin: 'none',
            }}
        />
    )
}

function SubTotal({ index }: { index: number }) {
    const { getFieldProps } = useFormikContext<FormData>()

    const { value: row } = getFieldProps(`spare_parts.${index}`)
    const { value: payment_method } = getFieldProps('payment_method')
    const { value: installment_margin } = getFieldProps(
        `spare_part_margins.${index}.margin_percentage`,
    )

    const rpWithoutMargin = (row.qty ?? 0) * (row.rp_per_unit ?? 0)

    const totalRp = Math.ceil(
        rpWithoutMargin +
            (rpWithoutMargin *
                (payment_method === 'installment'
                    ? (installment_margin ?? 0)
                    : 0)) /
                100,
    )

    return (
        <>
            <Typography variant="caption" color="textDisabled" component="div">
                subtotal:
            </Typography>

            <Typography
                component="div"
                fontWeight="bold"
                fontFamily="monospace"
                fontSize="1.4em">
                {numberToCurrency(totalRp)}
            </Typography>
        </>
    )
}
