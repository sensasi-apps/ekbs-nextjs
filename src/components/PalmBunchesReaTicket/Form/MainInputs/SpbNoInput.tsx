import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useState, useEffect } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import useFormData from '@/providers/useFormData'
import debounce from '@/lib/debounce'

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
                decimalScale: 0,
                minLength: 7,
                maxLength: 7,
                thousandSeparator: false,
            }}
            onChange={event => {
                const { name, value } = event.target

                clearByName(name)
                setSpbNo(value.replaceAll(/[^a-z0-9]/gi, '').toUpperCase())

                debounce(() => {
                    setData({
                        ...data,
                        [name]: tempValue,
                    })
                }, 2000)
            }}
            value={spbNo ?? ''}
            error={Boolean(validationErrors.spb_no)}
            helperText={validationErrors.spb_no}
        />
    )
}

export default SpbNoInput
