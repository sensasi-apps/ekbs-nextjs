import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useState, useEffect } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import useFormData from '@/providers/useFormData'
import { alpaNumeric } from '@/lib/RegExps'

let tempValue: string | undefined

const SpbNoInput: FC<{
    validationErrors: ValidationErrorsType
    disabled: boolean
    clearByName: (name: string) => void
}> = ({ disabled, clearByName, validationErrors }) => {
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

export default SpbNoInput
