import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import NumericFormat from '@/components/Global/NumericFormat'

const PalmBuncesReaTicketRegisterAsForm: FC<{
    data?: PalmBunchesReaTicketType
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
    data: palmBunchesReaTicket,
    disabled,
    validationErrors,
    clearByEvent,
}) => {
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
                            inputComponent: NumericFormat as any,
                        }}
                        inputProps={{
                            allowNegative: false,
                            thousandSeparator: false,
                            decimalScale: 0,
                            maxLength: 10,
                        }}
                        defaultValue={palmBunchesReaTicket?.as_farmer_id || ''}
                        onChange={clearByEvent}
                        error={Boolean(validationErrors?.as_farmer_id)}
                        helperText={validationErrors?.as_farmer_id}
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
                        defaultValue={
                            palmBunchesReaTicket?.as_farmer_name || ''
                        }
                        onChange={clearByEvent}
                        error={Boolean(validationErrors?.as_farmer_name)}
                        helperText={validationErrors?.as_farmer_name}
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
                        defaultValue={
                            palmBunchesReaTicket?.as_farm_land_id || ''
                        }
                        InputProps={{
                            inputComponent: NumericFormat as any,
                        }}
                        inputProps={{
                            allowNegative: false,
                            thousandSeparator: false,
                            decimalScale: 0,
                            maxLength: 10,
                        }}
                        onChange={clearByEvent}
                        error={Boolean(validationErrors?.as_farm_land_id)}
                        helperText={validationErrors?.as_farm_land_id}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default PalmBuncesReaTicketRegisterAsForm
