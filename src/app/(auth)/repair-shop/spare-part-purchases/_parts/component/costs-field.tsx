// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { FieldArrayRenderProps } from 'formik'
// vendors
import { useRef } from 'react'
import NumericField from '@/components/formik-fields/numeric-field'
// formik
import TextField from '@/components/formik-fields/text-field'
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
            <Box alignItems="center" display="flex" gap={2} mb={2}>
                <Typography component="div" fontWeight="bold">
                    Biaya Lain
                </Typography>

                <AddItemButton isDisabled={isDisabled} push={push} />
            </Box>

            {costs.map((_, index) => (
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
                        showDelete={index === costs.length - 1}
                    />

                    <NameInput index={index} isDisabled={isDisabled} />

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
        <Box alignItems="center" display="flex">
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
        <Grid pr={1} size={2} textAlign="right">
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
                disabled={isDisabled}
                label="Name"
                name={`costs.${index}.name`}
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
                disabled={isDisabled}
                label="Nilai"
                name={`costs.${index}.rp`}
                numericFormatProps={{
                    margin: 'none',
                }}
            />
        </Grid>
    )
}
