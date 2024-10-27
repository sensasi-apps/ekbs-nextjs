// vendors
import { memo, useState } from 'react'
import { Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

// components
import IconButton from '@/components/IconButton'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// utils
import TextField from '@/components/TextField'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import { FieldProps, FormikErrors } from 'formik'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import LaravelValidationException from '@/types/LaravelValidationException'
import { FormValuesType } from '../formik-component'

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
            <Grid2 xs={1}>
                <IconButton
                    sx={{
                        p: 0,
                    }}
                    title="hapus"
                    size="small"
                    icon={RemoveCircleIcon}
                    color="error"
                    onClick={onRemove}
                    disabled={disabled}
                />
            </Grid2>

            <Grid2
                xs={6}
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
            </Grid2>

            <Grid2
                xs={5}
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
            </Grid2>
        </>
    )
}

export default memo(CostItem)
