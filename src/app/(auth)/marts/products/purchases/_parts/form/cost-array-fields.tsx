// types

import AddCircleIcon from '@mui/icons-material/AddCircle'
import AutoFixHigh from '@mui/icons-material/AutoFixHigh'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// vendors
import type { FieldArrayRenderProps } from 'formik'
// components
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import RpInputAdornment from '@/components/input-adornments/rp'
import type ProductMovementCost from '@/modules/mart/types/orms/product-movement-cost'
// utils
import formatNumber from '@/utils/format-number'
import type { FormValues } from '../form'

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
            <Box alignItems="center" display="flex">
                <Typography>Rincian Biaya</Typography>
                <IconButton
                    color="success"
                    disabled={disabled}
                    onClick={() => push({})}
                    size="small">
                    <AddCircleIcon />
                </IconButton>
            </Box>
            {error && JSON.stringify(error) !== '{}' && (
                <FormHelperText component="ul" error>
                    {Object.values(error)
                        .flatMap((v: string | object | Array<object>) =>
                            typeof v === 'string'
                                ? [v]
                                : Object.values(v).flatMap(v =>
                                      Object.values(v),
                                  ),
                        )
                        .filter(Boolean)
                        .map(v => (
                            <Box component="li" key={v as string}>
                                {v as string}
                            </Box>
                        ))}
                </FormHelperText>
            )}
            <Grid alignItems="center" columnSpacing={1} container>
                {value?.length > 0 && <HeaderGrid />}

                {(value ?? []).map(({ name: costName }, index) => (
                    <Row
                        disabled={disabled}
                        index={index}
                        key={costName ?? index}
                        name={name}
                        remove={remove}
                    />
                ))}

                {value?.length > 0 && (
                    <>
                        <Grid offset={1} size={3} textAlign="right">
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
                                }}
                                size="small">
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
            <Grid offset={1} size={3} textAlign="center">
                <Typography variant="overline">Nama</Typography>
            </Grid>
            <Grid size={2.5} textAlign="center">
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
                <TextField disabled={disabled} name={`${name}.${index}.name`} />
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
                    color="error"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    size="small"
                    tabIndex={-1}>
                    <RemoveCircleIcon />
                </IconButton>
            </Grid>
        </>
    )
}
