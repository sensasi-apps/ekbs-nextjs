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
import Skeleton from '@mui/material/Skeleton'
import MuiTextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
// component
import { NumericField } from '@/components/FormikForm'
import RemoveButton from '@/components/remove-button'
// features
import type { FormData } from '@/features/repair-shop--sale/components/sale-form-dialog'
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'

export default function SparePartsArrayField({
    name,
    isDisabled,
}: {
    name: string
    isDisabled: boolean
}) {
    const {
        values: { uuid, spare_parts },
    } = useFormikContext<FormData>()

    return (
        <FieldArray name={name}>
            {({ push, remove, form: { setFieldValue } }) => {
                return (
                    <>
                        <Box display="flex" gap={2} alignItems="center" mb={2}>
                            <Typography fontWeight="bold" component="div">
                                Suku Cadang
                            </Typography>

                            {!uuid && (
                                <AddItemButton
                                    isDisabled={isDisabled}
                                    push={push}
                                />
                            )}
                        </Box>

                        {spare_parts?.map((row, index) => (
                            <Grid
                                key={index}
                                container
                                columnSpacing={1}
                                display="flex"
                                alignItems="center"
                                mb={1}>
                                <NumberCell
                                    index={index}
                                    remove={remove}
                                    isDisabled={isDisabled}
                                    showDelete={
                                        index === spare_parts.length - 1 &&
                                        !uuid
                                    }
                                />

                                <QtyInput
                                    isDisabled={isDisabled}
                                    name={`${name}.${index}.qty`}
                                />

                                <SparePartInput
                                    name={`${name}.${index}.spare_part_warehouse_id`}
                                    isDisabled={isDisabled}
                                    onChange={(_, selected) => {
                                        setFieldValue(
                                            `${name}.${index}.spare_part_warehouse_id`,
                                            selected?.spare_part_warehouse_id,
                                        )

                                        setFieldValue(
                                            `${name}.${index}.rp_per_unit`,
                                            selected?.default_sell_price,
                                        )
                                    }}
                                    state={row.spare_part_state}
                                />

                                <PriceInput
                                    isDisabled={isDisabled}
                                    name={`${name}.${index}.rp_per_unit`}
                                    value={row.rp_per_unit}
                                />

                                <SubTotal
                                    value={
                                        (row.qty ?? 0) * (row.rp_per_unit ?? 0)
                                    }
                                />
                            </Grid>
                        ))}
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

type SparePartForSale = {
    default_sell_price: number
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

    return (
        <Grid
            size={{
                xs: 12,
                sm: 4.5,
            }}>
            {state ? (
                `${state.id} — ${state.name}`
            ) : (
                <>
                    {isLoading && <Skeleton variant="rounded" />}
                    {!isLoading && (
                        <Field name={name}>
                            {({
                                field,
                                meta: { error },
                            }: FieldProps<number, FormData>) => {
                                const selectedValue =
                                    spareParts.find(
                                        sparePart =>
                                            sparePart.spare_part_warehouse_id ===
                                            field.value,
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
                                        getOptionDisabled={sparePart =>
                                            sparePart.qty <= 0
                                        }
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
                    )}
                </>
            )}
        </Grid>
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
    return (
        <Grid
            size={{ xs: 2, sm: 1 }}
            textAlign="right"
            pr={1}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
            {showDelete && (
                <RemoveButton
                    onClick={() => remove(index)}
                    isDisabled={isDisabled}
                />
            )}
            {index + 1}
        </Grid>
    )
}

function QtyInput({ name, isDisabled }: { name: string; isDisabled: boolean }) {
    return (
        <Grid
            size={{
                xs: 10,
                sm: 1.5,
            }}>
            <NumericField
                name={name}
                disabled={isDisabled}
                label="Jumlah"
                numericFormatProps={{
                    margin: 'none',
                }}
            />
        </Grid>
    )
}

function PriceInput({
    isDisabled,
    name,
    value,
}: {
    name: string
    isDisabled: boolean
    value: number | undefined
}) {
    return (
        <Grid
            size={{
                xs: 12,
                sm: 2,
            }}>
            <NumericField
                name={name}
                disabled={isDisabled}
                label="Harga satuan"
                numericFormatProps={{
                    margin: 'none',
                    value: value ?? '',
                }}
            />
        </Grid>
    )
}

function SubTotal({ value }: { value: number }) {
    return (
        <Grid
            size={{
                xs: 12,
                sm: 2.5,
            }}>
            <MuiTextField
                disabled={true}
                value={numberToCurrency(value)}
                fullWidth
                label="Subtotal"
                margin="none"
                variant="standard"
            />
        </Grid>
    )
}
