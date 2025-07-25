import { type ValidationErrorsType } from '@/types/ValidationErrors'
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'

import { type FC, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
// providers
import useFormData from '@/providers/useFormData'

let tempValue: string | undefined

const AsFarmLandIdInput: FC<{
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByName: (name: string) => void
}> = ({ disabled, validationErrors, clearByName }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicket>()
    const [asFarmLandId, setAsFarmLandId] = useState<string>(
        data.as_farm_land_id ?? '',
    )

    useEffect(() => {
        tempValue = data.as_farm_land_id
        setAsFarmLandId(data.as_farm_land_id ?? '')

        return () => {
            tempValue = undefined
        }
    }, [data.as_farm_land_id])

    return (
        <>
            <input
                type="hidden"
                name="as_farm_land_id"
                value={asFarmLandId ?? ''}
            />

            <PatternFormat
                format="#### ####"
                customInput={TextField}
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="Land ID"
                size="small"
                onValueChange={values => {
                    clearByName('as_farm_land_id')
                    setAsFarmLandId(values.value)

                    tempValue = values.value
                }}
                onBlur={() =>
                    data.id
                        ? null
                        : setData({
                              ...data,
                              as_farm_land_id: tempValue,
                          })
                }
                value={asFarmLandId}
                error={Boolean(validationErrors.as_farm_land_id)}
                helperText={validationErrors.as_farm_land_id}
            />
        </>
    )
}

export default AsFarmLandIdInput
