'use client'

// icons-materials
import RemoveCircle from '@mui/icons-material/RemoveCircle'
// materials
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// vendors
import type { FieldProps, FormikErrors } from 'formik'
import { memo, useState } from 'react'
// components
import IconButton from '@/components/icon-button'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// types
import type { FormValuesType } from '../../../../components/pages/marts/products/sales/formik-wrapper'

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
                    color="error"
                    disabled={disabled}
                    icon={RemoveCircle}
                    onClick={onRemove}
                    size="small"
                    sx={{
                        p: 0,
                    }}
                    title="hapus"
                />
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                pl={1}
                size={{ xs: 6 }}
                textOverflow="ellipsis"
                variant="caption"
                whiteSpace="nowrap">
                <TextField
                    disabled={disabled}
                    fullWidth
                    inputProps={{
                        style: {
                            fontFamily: 'Roboto',
                            fontSize: '0.8em',
                        },
                    }}
                    margin="none"
                    name="name"
                    onChange={({ target: { value } }) => {
                        setName(value)

                        onDataChange({
                            name: value,
                            rp,
                        })
                    }}
                    placeholder="nama biaya / diskon"
                    value={name}
                    variant="standard"
                    {...errorsToHelperTextObj(
                        errors?.[`costs.${index}.name`] ?? error?.name,
                    )}
                />
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                size={{ xs: 5 }}
                textAlign="end"
                variant="caption">
                <NumericFormat
                    allowNegative
                    disabled={disabled}
                    InputProps={{
                        startAdornment: (
                            <RpInputAdornment
                                sx={{
                                    '& > p': {
                                        fontFamily: 'Roboto',
                                        fontSize: '0.8em',
                                    },
                                }}
                            />
                        ),
                    }}
                    inputProps={{
                        style: {
                            fontFamily: 'Roboto',
                            fontSize: '0.8em',
                            textAlign: 'end',
                        },
                    }}
                    margin="none"
                    onValueChange={({ floatValue }) => {
                        setRp(floatValue)

                        onDataChange({
                            name,
                            rp: floatValue,
                        })
                    }}
                    placeholder="0"
                    value={rp}
                    variant="standard"
                    {...errorsToHelperTextObj(
                        errors?.[`costs.${index}.rp`] ?? error?.rp,
                    )}
                />
            </Grid>
        </>
    )
}

export default memo(CostItem)
