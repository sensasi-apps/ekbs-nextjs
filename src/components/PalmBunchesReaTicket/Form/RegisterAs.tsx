import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

// components
import NumericFormat from '@/components/Global/NumericFormat'

// providers
import useFormData from '@/providers/useFormData'

const PalmBuncesReaTicketRegisterAsForm: FC<{
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ disabled, validationErrors, clearByEvent }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()

    const [localData, setLocalData] = useState<PalmBunchesReaTicketType>(data)

    const {
        as_farmer_id = '',
        as_farmer_name = '',
        as_farm_land_id = '',
    } = localData

    useEffect(() => {
        setLocalData(data)
    }, [data])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearByEvent(event)
        const { name, value } = event.target

        setLocalData(prevState => {
            const newData = { ...prevState, [name]: value }

            setData(newData)

            return newData
        })
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
                        value={as_farmer_id}
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
                        value={as_farmer_name}
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
                        value={as_farm_land_id}
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

export default PalmBuncesReaTicketRegisterAsForm
