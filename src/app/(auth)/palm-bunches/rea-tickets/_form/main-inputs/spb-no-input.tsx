// types

// materials
import InputAdornment from '@mui/material/InputAdornment'
// vendors
import { useEffect, useState } from 'react'
// components
import TextField from '@/components/text-field'
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
// utils
import { alpaNumeric } from '@/utils/regexs'

let tempValue: string | undefined

export default function SpbNoInput({
    disabled,
    clearByName,
    validationErrors,
}: {
    validationErrors: LaravelValidationExceptionResponse['errors']
    disabled: boolean
    clearByName: (name: string) => void
}) {
    const { data, setData } = useFormData<PalmBunchesReaTicketORM>()
    const [internalValue, setInternalValue] = useState(data.spb_no ?? '')

    useEffect(() => {
        tempValue = data.spb_no
        setInternalValue(data.spb_no ?? '')

        return () => {
            tempValue = undefined
        }
    }, [data.spb_no])

    return (
        <TextField
            disabled={disabled}
            error={Boolean(validationErrors.spb_no)}
            helperText={validationErrors.spb_no}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">BS-MI</InputAdornment>
                ),
            }}
            inputProps={{
                maxLength: 8,
                minLength: 7,
            }}
            label="No. SPB"
            name="spb_no"
            onBlur={() =>
                data.id
                    ? null
                    : setData({
                          ...data,
                          spb_no: tempValue,
                      })
            }
            onChange={event => {
                const { value } = event.target
                if (value !== '' && !alpaNumeric.test(value)) return
                tempValue = value.toUpperCase()

                clearByName('spb_no')
                setInternalValue(tempValue)
            }}
            value={internalValue}
        />
    )
}
