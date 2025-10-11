// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import MuiTextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Field, type FieldArrayRenderProps, type FieldProps } from 'formik'
// vendors
import { useRef } from 'react'
import useSWR from 'swr'
// formik
import NumericField from '@/components/formik-fields/numeric-field'
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
// features
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import Endpoint from '../enums/endpoint'

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
            <Box alignItems="center" display="flex" gap={2} mb={2}>
                <Typography component="div" fontWeight="bold">
                    Suku Cadang
                </Typography>

                <AddItemButton isDisabled={isDisabled} push={push} />
            </Box>

            {details.map((row, index) => (
                <Grid
                    alignItems="center"
                    columnSpacing={1}
                    container
                    display="flex"
                    key={index}
                    mb={1}>
                    <NumberCell
                        index={index}
                        isDisabled={isDisabled}
                        remove={remove}
                        showDelete={index === details.length - 1}
                    />

                    <QtyInput index={index} isDisabled={isDisabled} />
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
        <Box alignItems="center" display="flex" mt={1}>
            <MuiTextField
                defaultValue={1}
                disabled={isDisabled}
                fullWidth={false}
                label="Tambah baris"
                onChange={e => (nRow.current = Number(e.target.value))}
                size="small"
                slotProps={{ input: { inputProps: { max: 99, min: 1 } } }}
                sx={{
                    maxWidth: '4em',
                }}
                type="number"
            />

            <Tooltip arrow placement="top" title="Tambah">
                <span>
                    <IconButton
                        color="success"
                        disabled={isDisabled}
                        onClick={() => {
                            for (let i = 0; i < nRow.current; i++) {
                                push({})
                            }
                        }}
                        size="small">
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
                sm: 4.5,
                xs: 12,
            }}>
            <Field name={`details.${index}.spare_part_id`}>
                {({ form: { setFieldValue }, field }: FieldProps) => {
                    const value =
                        spareParts.find(
                            sparePart => sparePart.id == field.value,
                        ) ?? null

                    return (
                        <Autocomplete
                            disabled={isDisabled}
                            getOptionLabel={sparePart =>
                                `${sparePart.id} — ${sparePart.name}`
                            }
                            id={field.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            onChange={(_, selected) => {
                                setFieldValue(field.name, selected?.id)
                            }}
                            options={spareParts}
                            renderInput={params => (
                                <MuiTextField
                                    {...params}
                                    label="Suku Cadang"
                                    margin="none"
                                    required
                                    size="small"
                                />
                            )}
                            value={value}
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
        <Grid pr={1} size={{ sm: 1, xs: 2 }} textAlign="right">
            {showDelete && (
                <Tooltip arrow placement="top" title="Hapus">
                    <span>
                        <IconButton
                            color="error"
                            disabled={isDisabled}
                            onClick={() => {
                                remove(index)
                            }}
                            size="small">
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
                sm: 1.5,
                xs: 10,
            }}>
            <NumericField
                disabled={isDisabled}
                label="Jumlah"
                name={`details.${index}.qty`}
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
                sm: 2,
                xs: 12,
            }}>
            <NumericField
                disabled={isDisabled}
                label="Harga satuan"
                name={`details.${index}.rp_per_unit`}
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
                sm: 2.5,
                xs: 12,
            }}>
            <MuiTextField
                disabled={true}
                fullWidth
                label="Subtotal"
                margin="none"
                value={numberToCurrency(value)}
                variant="standard"
            />
        </Grid>
    )
}
