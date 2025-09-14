// types
import { type FieldArrayRenderProps } from 'formik'
// vendors
import { useRef } from 'react'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// formik
import TextField from '@/components/formik-fields/text-field'
import NumericField from '@/components/formik-fields/numeric-field'
// features
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'

export default function CostsField({
    push,
    remove,
    isDisabled,
    form: { values },
}: {
    isDisabled: boolean
} & FieldArrayRenderProps) {
    const costs = values.costs as Partial<SparePartMovement['costs'][number]>[]

    return (
        <>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Typography fontWeight="bold" component="div">
                    Biaya Lain
                </Typography>

                <AddItemButton isDisabled={isDisabled} push={push} />
            </Box>

            {costs.map((_, index) => (
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
                        showDelete={index === costs.length - 1}
                    />

                    <NameInput isDisabled={isDisabled} index={index} />

                    <RpInput index={index} isDisabled={isDisabled} />
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
        <Box display="flex" alignItems="center">
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
        <Grid size={2} textAlign="right" pr={1}>
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

function NameInput({
    isDisabled,
    index,
}: {
    isDisabled: boolean
    index: number
}) {
    return (
        <Grid size={5}>
            <TextField
                name={`costs.${index}.name`}
                disabled={isDisabled}
                label="Name"
                textFieldProps={{
                    margin: 'none',
                }}
            />
        </Grid>
    )
}

function RpInput({
    isDisabled,
    index,
}: {
    isDisabled: boolean
    index: number
}) {
    return (
        <Grid size={5}>
            <NumericField
                name={`costs.${index}.rp`}
                disabled={isDisabled}
                label="Nilai"
                numericFormatProps={{
                    margin: 'none',
                }}
            />
        </Grid>
    )
}
