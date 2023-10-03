import type ValidationErrorsType from '@/types/ValidationErrors'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'

import { FC, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
// libs
import debounce from '@/lib/debounce'
// providers
import useFormData from '@/providers/useFormData'

let tempValue: string | undefined

const AsFarmLandIdInput: FC<{
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByName: (name: string) => void
}> = ({ disabled, validationErrors, clearByName }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()
    const [asFarmLandId, setAsFarmLandId] = useState<string>()

    useEffect(() => {
        tempValue = data.as_farm_land_id

        return () => {
            tempValue = undefined
        }
    }, [])

    useEffect(() => {
        setAsFarmLandId(data.as_farm_land_id)
    }, [data.as_farm_land_id])
    return (
        <PatternFormat
            format="#### ####"
            maxLength={8}
            minLength={8}
            customInput={TextField}
            disabled={disabled}
            fullWidth
            required
            margin="dense"
            label="Land ID"
            size="small"
            name="as_farm_land_id"
            onChange={event => {
                const { name, value } = event.target

                clearByName(name)
                setAsFarmLandId(value)
                debounce(() => {
                    setData({
                        ...data,
                        [name]: tempValue,
                    })
                }, 2000)
            }}
            value={asFarmLandId ?? ''}
            error={Boolean(validationErrors.as_farm_land_id)}
            helperText={validationErrors.as_farm_land_id}
        />
    )
}

export default AsFarmLandIdInput
