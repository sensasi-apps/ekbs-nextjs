'use client'

// types
import type { FormValuesType } from '../../../../components/pages/marts/products/sales/formik-wrapper'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vendors
import type { FieldProps, FormikErrors } from 'formik'
import { memo, useState } from 'react'
// materials
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// icons-materials
import RemoveCircle from '@mui/icons-material/RemoveCircle'
// components
import IconButton from '@/components/IconButton'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

function CostItem({
    index,
    onRemove,
    onDataChange,
    data: { name: costName, rp: costRp },
    errors,
    error,
    disabled,
}: {
    index: number
    disabled: boolean
    onRemove: () => void
    onDataChange: (data: FormValuesType['costs'][0]) => void
    data: FormValuesType['costs'][0]
    setFieldValue: FieldProps['form']['setFieldValue']
    errors: FormikErrors<LaravelValidationException['errors']> | undefined
    error: { name?: string; rp?: string } | undefined
}) {
    const [name, setName] = useState(costName)
    const [rp, setRp] = useState(costRp)

    return (
        <>
            <Grid size={{ xs: 1 }}>
                <IconButton
                    sx={{
                        p: 0,
                    }}
                    title="hapus"
                    size="small"
                    icon={RemoveCircle}
                    color="error"
                    onClick={onRemove}
                    disabled={disabled}
                />
            </Grid>

            <Grid
                size={{ xs: 6 }}
                component={Typography}
                lineHeight="unset"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                variant="caption"
                pl={1}>
                <TextField
                    fullWidth
                    name="name"
                    placeholder="nama biaya / diskon"
                    variant="standard"
                    margin="none"
                    value={name}
                    disabled={disabled}
                    onChange={({ target: { value } }) => {
                        setName(value)

                        onDataChange({
                            name: value,
                            rp,
                        })
                    }}
                    inputProps={{
                        style: {
                            fontSize: '0.8em',
                            fontFamily: 'Roboto',
                        },
                    }}
                    {...errorsToHelperTextObj(
                        errors?.[`costs.${index}.name`] ?? error?.name,
                    )}
                />
            </Grid>

            <Grid
                size={{ xs: 5 }}
                textAlign="end"
                component={Typography}
                variant="caption"
                lineHeight="unset">
                <NumericFormat
                    value={rp}
                    allowNegative
                    disabled={disabled}
                    onValueChange={({ floatValue }) => {
                        setRp(floatValue)

                        onDataChange({
                            name,
                            rp: floatValue,
                        })
                    }}
                    inputProps={{
                        style: {
                            textAlign: 'end',
                            fontSize: '0.8em',
                            fontFamily: 'Roboto',
                        },
                    }}
                    margin="none"
                    variant="standard"
                    placeholder="0"
                    InputProps={{
                        startAdornment: (
                            <RpInputAdornment
                                sx={{
                                    '& > p': {
                                        fontSize: '0.8em',
                                        fontFamily: 'Roboto',
                                    },
                                }}
                            />
                        ),
                    }}
                    {...errorsToHelperTextObj(
                        errors?.[`costs.${index}.rp`] ?? error?.rp,
                    )}
                />
            </Grid>
        </>
    )
}

export default memo(CostItem)
