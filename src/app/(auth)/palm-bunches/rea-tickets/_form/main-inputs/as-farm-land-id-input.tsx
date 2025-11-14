import TextField from '@mui/material/TextField'

import { type FC, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'

let tempValue: string | undefined

const AsFarmLandIdInput: FC<{
    disabled: boolean
    validationErrors: LaravelValidationExceptionResponse['errors']
    clearByName: (name: string) => void
}> = ({ disabled, validationErrors, clearByName }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketORM>()
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
                name="as_farm_land_id"
                type="hidden"
                value={asFarmLandId ?? ''}
            />

            <PatternFormat
                customInput={TextField}
                disabled={disabled}
                error={Boolean(validationErrors.as_farm_land_id)}
                format="#### ####"
                fullWidth
                helperText={validationErrors.as_farm_land_id}
                label="Land ID"
                margin="dense"
                onBlur={() =>
                    data.id
                        ? null
                        : setData({
                              ...data,
                              as_farm_land_id: tempValue,
                          })
                }
                onValueChange={values => {
                    clearByName('as_farm_land_id')
                    setAsFarmLandId(values.value)

                    tempValue = values.value
                }}
                required
                size="small"
                value={asFarmLandId}
            />
        </>
    )
}

export default AsFarmLandIdInput
