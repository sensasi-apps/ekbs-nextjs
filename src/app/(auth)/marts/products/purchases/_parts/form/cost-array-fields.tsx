// types
import type ProductMovementCost from '@/modules/mart/types/orms/product-movement-cost'
import type { FormValues } from '../form'
// vendors
import type { FieldArrayRenderProps } from 'formik'
// materials
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// components
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// utils
import formatNumber from '@/utils/format-number'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AutoFixHigh from '@mui/icons-material/AutoFixHigh'

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
            <Grid container columnSpacing={1} alignItems="center">
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
                        <Grid textAlign="right" size={3} offset={1}>
                            <Typography variant="overline">Total</Typography>
                        </Grid>

                        <Grid justifyContent="space-between" px={2} size={2.5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="overline">Rp</Typography>
                                <Typography variant="overline">
                                    {formatNumber(costsTotal)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={5.5}>
                            <IconButton
                                color="warning"
                                size="small"
                                disabled={disabled}
                                onClick={() => {
                                    const { value } =
                                        getFieldMeta<FormValues['details']>(
                                            'details',
                                        )

                                    const qtyTotal = value?.reduce(
                                        (acc, curr) => acc + (curr.qty ?? 0),
                                        0,
                                    )

                                    const costRpPerUnit =
                                        costsTotal / (qtyTotal ?? 1)

                                    const newDetails = value?.map(detail => ({
                                        ...detail,
                                        cost_rp_per_unit: costRpPerUnit,
                                    }))

                                    setFieldValue('details', newDetails)
                                }}>
                                <AutoFixHigh />
                            </IconButton>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    )
}

function HeaderGrid() {
    return (
        <>
            <Grid textAlign="center" size={3} offset={1}>
                <Typography variant="overline">Nama</Typography>
            </Grid>
            <Grid textAlign="center" size={2.5}>
                <Typography variant="overline">Nilai</Typography>
            </Grid>
            <Grid size={5.5} />
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
            <Grid size={{ xs: 1 }} textAlign="center">
                <Typography variant="overline">{index + 1}</Typography>
            </Grid>
            <Grid size={3}>
                <TextField name={`${name}.${index}.name`} disabled={disabled} />
            </Grid>
            <Grid size={2.5}>
                <NumericField
                    disabled={disabled}
                    name={`${name}.${index}.rp`}
                    numericFormatProps={{
                        InputProps: {
                            startAdornment: <RpInputAdornment />,
                        },
                    }}
                />
            </Grid>
            <Grid size={5.5}>
                <IconButton
                    disabled={disabled}
                    tabIndex={-1}
                    onClick={() => remove(index)}
                    size="small"
                    color="error">
                    <RemoveCircleIcon />
                </IconButton>
            </Grid>
        </>
    )
}
