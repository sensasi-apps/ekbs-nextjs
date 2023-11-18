// types
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'
// vendors
import { useState, useEffect } from 'react'
// materials
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
// utils
import useFormData from '@/providers/useFormData'
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
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()
    const [spbNo, setSpbNo] = useState(data.spb_no)

    useEffect(() => {
        tempValue = data.spb_no

        return () => {
            tempValue = undefined
        }
    }, [])

    useEffect(() => {
        if (data.spb_no === spbNo) return

        setSpbNo(data.spb_no)
    }, [data.spb_no])

    return (
        <TextField
            disabled={disabled}
            fullWidth
            required
            margin="dense"
            label="No. SPB"
            size="small"
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
                setSpbNo(tempValue)
            }}
            onBlur={() =>
                data.id
                    ? null
                    : setData({
                          ...data,
                          spb_no: tempValue,
                      })
            }
            value={spbNo ?? ''}
            error={Boolean(validationErrors.spb_no)}
            helperText={validationErrors.spb_no}
        />
    )
}
