// types
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'
import { type ValidationErrorsType } from '@/types/ValidationErrors'
// vendors
import { useState, useEffect } from 'react'
// materials
import InputAdornment from '@mui/material/InputAdornment'
// components
import TextField from '@/components/TextField'
// providers
import useFormData from '@/providers/useFormData'
// utils
import { alpaNumeric } from '@/utils/RegExps'

let tempValue: string | undefined

export default function SpbNoInput({
    disabled,
    clearByName,
    validationErrors,
}: {
    validationErrors: ValidationErrorsType
    disabled: boolean
    clearByName: (name: string) => void
}) {
    const { data, setData } = useFormData<PalmBunchesReaTicket>()
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
            label="No. SPB"
            name="spb_no"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">BS-MI</InputAdornment>
                ),
            }}
            inputProps={{
                minLength: 7,
                maxLength: 8,
            }}
            onChange={event => {
                const { value } = event.target
                if (value !== '' && !alpaNumeric.test(value)) return
                tempValue = value.toUpperCase()

                clearByName('spb_no')
                setInternalValue(tempValue)
            }}
            onBlur={() =>
                data.id
                    ? null
                    : setData({
                          ...data,
                          spb_no: tempValue,
                      })
            }
            value={internalValue}
            error={Boolean(validationErrors.spb_no)}
            helperText={validationErrors.spb_no}
        />
    )
}
