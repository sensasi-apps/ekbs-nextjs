// types
import type ProductMovementCost from '@/dataTypes/mart/ProductMovementCost'
// vendors
import { FieldArrayRenderProps } from 'formik'
// materials
import { Box, FormHelperText, IconButton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import { NumericField, TextField } from '@/components/FormikForm'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// utils
import formatNumber from '@/utils/formatNumber'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AutoFixHigh from '@mui/icons-material/AutoFixHigh'
import ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'

export default function ProductMovementCostArrayFields({
    push,
    remove,
    name,
    form: { getFieldMeta, setFieldValue },
    disabled,
}: FieldArrayRenderProps & { disabled: boolean }) {
    const { value, error } = getFieldMeta<ProductMovementCost[]>(name)

    const costsTotal = value?.reduce((acc, curr) => acc + (curr.rp ?? 0), 0)

    return (
        <Box mb={4}>
            <Box display="flex" alignItems="center">
                <Typography>Rincian Biaya</Typography>
                <IconButton
                    size="small"
                    color="success"
                    disabled={disabled}
                    onClick={() => push({})}>
                    <AddCircleIcon />
                </IconButton>
            </Box>
            <FormHelperText error>{error}</FormHelperText>

            <Grid2 container columnSpacing={1} alignItems="center">
                {value?.length > 0 && <HeaderGrid />}

                {(value ?? []).map((_, index) => (
                    <Row
                        name={name}
                        key={index}
                        index={index}
                        remove={remove}
                        disabled={disabled}
                    />
                ))}

                {value?.length > 0 && (
                    <>
                        <Grid2 xs={3} xsOffset={1} textAlign="right">
                            <Typography variant="overline">Total</Typography>
                        </Grid2>

                        <Grid2 xs={2.5} justifyContent="space-between" px={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="overline">Rp</Typography>
                                <Typography variant="overline">
                                    {formatNumber(costsTotal)}
                                </Typography>
                            </Box>
                        </Grid2>

                        <Grid2 xs={5.5}>
                            <IconButton
                                color="warning"
                                size="small"
                                disabled={disabled}
                                onClick={() => {
                                    const { value } =
                                        getFieldMeta<ProductMovementDetail[]>(
                                            'details',
                                        )

                                    const newDetails = value?.map(detail => ({
                                        ...detail,
                                        cost_rp_total:
                                            costsTotal / (value.length ?? 1),
                                    }))

                                    setFieldValue('details', newDetails)
                                }}>
                                <AutoFixHigh />
                            </IconButton>
                        </Grid2>
                    </>
                )}
            </Grid2>
        </Box>
    )
}

function HeaderGrid() {
    return (
        <>
            <Grid2 xs={3} xsOffset={1} textAlign="center">
                <Typography variant="overline">Nama</Typography>
            </Grid2>

            <Grid2 xs={2.5} textAlign="center">
                <Typography variant="overline">Nilai</Typography>
            </Grid2>

            <Grid2 xs={5.5} />
        </>
    )
}

function Row({
    name,
    index,
    disabled,
    remove,
}: {
    name: string
    index: number
    disabled: boolean
    remove: (index: number) => void
}) {
    return (
        <>
            <Grid2 xs={1} textAlign="center">
                <Typography variant="overline">{index + 1}</Typography>
            </Grid2>
            <Grid2 xs={3}>
                <TextField name={`${name}.${index}.name`} disabled={disabled} />
            </Grid2>

            <Grid2 xs={2.5}>
                <NumericField
                    disabled={disabled}
                    name={`${name}.${index}.rp`}
                    numericFormatProps={{
                        InputProps: {
                            startAdornment: <RpInputAdornment />,
                        },
                    }}
                />
            </Grid2>

            <Grid2 xs={5.5}>
                <IconButton
                    disabled={disabled}
                    tabIndex={-1}
                    onClick={() => remove(index)}
                    size="small"
                    color="error">
                    <RemoveCircleIcon />
                </IconButton>
            </Grid2>
        </>
    )
}
