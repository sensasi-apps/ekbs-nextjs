import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useEffect, useState, memo } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

// components
import NumericFormat from '@/components/Global/NumericFormat'
// libs
import debounce from '@/lib/debounce'
// providers
import useFormData from '@/providers/useFormData'

let tempData: any

const PalmBuncesReaTicketRegisterAsForm: FC<{
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ disabled, validationErrors, clearByEvent }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()

    const [asFarmerId, setAsFarmerId] = useState<string>(data.as_farmer_id)
    const [asFarmerName, setAsFarmerName] = useState<string>(
        data.as_farmer_name,
    )
    const [asFarmLandId, setAsFarmLandId] = useState<string>(
        data.as_farm_land_id,
    )

    useEffect(() => {
        tempData = {}

        return () => {
            tempData = undefined
        }
    }, [data])

    useEffect(() => {
        setAsFarmerId(data.as_farmer_id)
    }, [data.as_farmer_id])

    useEffect(() => {
        setAsFarmerName(data.as_farmer_name)
    }, [data.as_farmer_name])

    useEffect(() => {
        setAsFarmLandId(data.as_farm_land_id)
    }, [data.as_farm_land_id])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearByEvent(event)

        const { name, value } = event.target

        if (name === 'as_farmer_id') setAsFarmerId(value)
        if (name === 'as_farmer_name') setAsFarmerName(value)
        if (name === 'as_farm_land_id') setAsFarmLandId(value)

        tempData[name] = value
        debounce(
            () =>
                setData({
                    ...data,
                    ...tempData,
                }),
            200,
        )
    }

    return (
        <>
            <Typography variant="h6" component="h2" mt={3} mb={2}>
                Atas Nama
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="ID Petani"
                        name="as_farmer_id"
                        margin="none"
                        required
                        disabled={disabled}
                        InputProps={{
                            inputComponent: NumericFormat,
                        }}
                        inputProps={{
                            allowNegative: false,
                            thousandSeparator: false,
                            decimalScale: 0,
                            minLength: 16,
                            maxLength: 16,
                        }}
                        value={asFarmerId ?? ''}
                        onChange={handleChange}
                        error={Boolean(validationErrors.as_farmer_id)}
                        helperText={validationErrors.as_farmer_id}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Petani"
                        name="as_farmer_name"
                        margin="none"
                        required
                        disabled={disabled}
                        value={asFarmerName ?? ''}
                        onChange={handleChange}
                        error={Boolean(validationErrors.as_farmer_name)}
                        helperText={validationErrors.as_farmer_name}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        size="small"
                        margin="none"
                        label="LAND ID"
                        name="as_farm_land_id"
                        required
                        disabled={disabled}
                        value={asFarmLandId ?? ''}
                        InputProps={{
                            inputComponent: NumericFormat,
                        }}
                        inputProps={{
                            allowNegative: false,
                            thousandSeparator: false,
                            decimalScale: 0,
                            maxLength: 10,
                        }}
                        onChange={handleChange}
                        error={Boolean(validationErrors.as_farm_land_id)}
                        helperText={validationErrors.as_farm_land_id}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(PalmBuncesReaTicketRegisterAsForm)
