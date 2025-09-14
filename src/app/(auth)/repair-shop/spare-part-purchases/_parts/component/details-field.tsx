// types
import { Field, type FieldArrayRenderProps, type FieldProps } from 'formik'
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
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// utils
import Endpoint from '../enums/endpoint'
import numberToCurrency from '@/utils/number-to-currency'
// formik
import NumericField from '@/components/formik-fields/numeric-field'
// features
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'

export default function DetailsField({
    push,
    remove,
    isDisabled,
    form: { values },
}: {
    isDisabled: boolean
} & FieldArrayRenderProps) {
    const details = values.details as Partial<
        SparePartMovement['details'][number]
    >[]

    return (
        <>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Typography fontWeight="bold" component="div">
                    Suku Cadang
                </Typography>

                <AddItemButton isDisabled={isDisabled} push={push} />
            </Box>

            {details.map((row, index) => (
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
                        showDelete={index === details.length - 1}
                    />

                    <QtyInput isDisabled={isDisabled} index={index} />
                    <SparePartInput index={index} isDisabled={isDisabled} />
                    <PriceInput index={index} isDisabled={isDisabled} />

                    <SubTotal value={(row.qty ?? 0) * (row.rp_per_unit ?? 0)} />
                </Grid>
            ))}
        </>
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

function SparePartInput({
    isDisabled,
    index,
}: {
    isDisabled: boolean
    index: number
}) {
    const { data: spareParts = [], isLoading } = useSWR<SparePart[]>(
        Endpoint.SPARE_PARTS_LIST,
    )

    if (isLoading) {
        return <Skeleton variant="rounded" />
    }

    return (
        <Grid
            size={{
                xs: 12,
                sm: 4.5,
            }}>
            <Field name={`details.${index}.spare_part_id`}>
                {({ form: { setFieldValue }, field }: FieldProps) => {
                    const value =
                        spareParts.find(
                            sparePart => sparePart.id == field.value,
                        ) ?? null

                    return (
                        <Autocomplete
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            id={field.name}
                            value={value}
                            options={spareParts}
                            disabled={isDisabled}
                            getOptionLabel={sparePart =>
                                `${sparePart.id} — ${sparePart.name}`
                            }
                            onChange={(_, selected) => {
                                setFieldValue(field.name, selected?.id)
                            }}
                            renderInput={params => (
                                <MuiTextField
                                    {...params}
                                    required
                                    label="Suku Cadang"
                                    size="small"
                                    margin="none"
                                />
                            )}
                        />
                    )
                }}
            </Field>
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
        <Grid size={{ xs: 2, sm: 1 }} textAlign="right" pr={1}>
            {showDelete && (
                <Tooltip placement="top" arrow title="Hapus">
                    <span>
                        <IconButton
                            disabled={isDisabled}
                            color="error"
                            size="small"
                            onClick={() => {
                                remove(index)
                            }}>
                            <RemoveCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
            {index + 1}
        </Grid>
    )
}

function QtyInput({
    isDisabled,
    index,
}: {
    isDisabled: boolean
    index: number
}) {
    return (
        <Grid
            size={{
                xs: 10,
                sm: 1.5,
            }}>
            <NumericField
                name={`details.${index}.qty`}
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
    index,
}: {
    isDisabled: boolean
    index: number
}) {
    return (
        <Grid
            size={{
                xs: 12,
                sm: 2,
            }}>
            <NumericField
                name={`details.${index}.rp_per_unit`}
                disabled={isDisabled}
                label="Harga satuan"
                numericFormatProps={{
                    margin: 'none',
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
