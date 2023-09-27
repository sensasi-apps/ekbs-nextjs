import { FC, useState } from 'react'

import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import DatePicker from '@/components/Global/DatePicker'
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
import NumericFormat from '@/components/Global/NumericFormat'
import PalmBunchesReaTicketDataType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

type MainInputPropTypes = {
    data?: PalmBunchesReaTicketDataType
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByName: (name: string) => void
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const PalmBunchesReaDeliveryMainInputs: FC<MainInputPropTypes> = ({
    data: dataProp = {} as PalmBunchesReaTicketDataType,
    disabled,
    validationErrors,
    clearByName,
    clearByEvent,
}) => {
    const [data, setData] = useState(dataProp)

    const {
        id,
        at,
        spb_no = '',
        ticket_no = '',
        gradis_no = '',
        vebewe_no = '',
        rp_per_kg = '',

        delivery: {
            to_oil_mill_code = '',
            from_position = '',
            n_bunches = '',
            vehicle_no = '',
            courier_user = null,
        } = {},
    } = data

    return (
        <>
            <Typography variant="h6" component="h2" gutterBottom>
                Data Pengangkutan
            </Typography>

            {id && (
                <TextField
                    disabled
                    fullWidth
                    size="small"
                    variant="filled"
                    sx={{
                        mb: 2,
                    }}
                    label="ID"
                    value={id}
                    error={Boolean(validationErrors.id)}
                    helperText={validationErrors.id}
                />
            )}

            <DatePicker
                disabled={disabled}
                defaultValue={at}
                slotProps={{
                    textField: {
                        required: true,
                        fullWidth: true,
                        name: 'at',
                        label: 'Tanggal',
                        margin: 'dense',
                        size: 'small',
                        error: Boolean(validationErrors.at),
                        helperText: validationErrors.at,
                    },
                }}
                onChange={() => clearByName('at')}
            />

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
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 7,
                    maxLength: 7,
                    thousandSeparator: false,
                }}
                onChange={clearByEvent}
                defaultValue={spb_no}
                error={Boolean(validationErrors.spb_no)}
                helperText={validationErrors.spb_no}
            />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="No. Tiket"
                size="small"
                name="ticket_no"
                InputProps={{
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 10,
                    maxLength: 10,
                    thousandSeparator: false,
                }}
                onChange={clearByEvent}
                defaultValue={ticket_no}
                error={Boolean(validationErrors.ticket_no)}
                helperText={validationErrors.ticket_no}
            />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="No. Gradis"
                size="small"
                name="gradis_no"
                InputProps={{
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    thousandSeparator: false,
                    minLength: 12,
                    maxLength: 12,
                }}
                onChange={clearByEvent}
                defaultValue={gradis_no}
                error={Boolean(validationErrors.gradis_no)}
                helperText={validationErrors.gradis_no}
            />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="No. VeBeWe"
                size="small"
                name="vebewe_no"
                InputProps={{
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 12,
                    maxLength: 12,
                    thousandSeparator: false,
                }}
                onChange={clearByEvent}
                defaultValue={vebewe_no}
                error={Boolean(validationErrors.vebewe_no)}
                helperText={validationErrors.vebewe_no}
            />

            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <SelectFromApi
                        required
                        endpoint="/data/oil-mills"
                        disabled={disabled}
                        label="Pabrik tujuan"
                        size="small"
                        margin="dense"
                        onChange={clearByEvent}
                        defaultValue={to_oil_mill_code}
                        selectProps={{
                            name: 'to_oil_mill_code',
                        }}
                        error={Boolean(validationErrors.to_oil_mill_code)}
                        helperText={validationErrors.to_oil_mill_code}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SelectFromApi
                        required
                        endpoint="/data/rea-delivery-from-positions"
                        disabled={disabled}
                        label="Dari Posisi"
                        size="small"
                        margin="dense"
                        defaultValue={from_position}
                        selectProps={{
                            name: 'from_position',
                        }}
                        onChange={clearByEvent}
                        error={Boolean(validationErrors.from_position)}
                        helperText={validationErrors.from_position}
                    />
                </Grid>
            </Grid>

            <input type="hidden" name="rp_per_kg" value={rp_per_kg} />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="Harga Sawit"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">Rp.</InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">/kg</InputAdornment>
                    ),
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 2,
                    maxLength: 6,
                    onValueChange: ({ floatValue }: any) => {
                        setData((prevData: any) => ({
                            ...prevData,
                            rp_per_kg: floatValue,
                        }))
                    },
                }}
                onChange={() => clearByName('rp_per_kg')}
                defaultValue={rp_per_kg}
                error={Boolean(validationErrors.rp_per_kg)}
                helperText={validationErrors.rp_per_kg}
            />

            <input type="hidden" name="n_bunches" value={n_bunches || ''} />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="Total Janjang"
                size="small"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">Janjang</InputAdornment>
                    ),
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    decimalScale: 0,
                    maxLength: 10,
                    onValueChange: ({ floatValue }: any) => {
                        setData(prevData => ({
                            ...prevData,
                            delivery: {
                                ...prevData.delivery,
                                n_bunches: floatValue,
                            },
                        }))
                        clearByName('n_bunches')
                    },
                }}
                onChange={clearByEvent}
                defaultValue={n_bunches}
                error={Boolean(validationErrors.n_bunches)}
                helperText={validationErrors.n_bunches}
            />

            <input
                type="hidden"
                name="courier_user_uuid"
                value={courier_user?.uuid || ''}
            />

            <UserAutocomplete
                disabled={disabled}
                fullWidth
                onChange={(_, user) => {
                    setData((prevData: any) => ({
                        ...prevData,
                        delivery: {
                            ...prevData.delivery,
                            courier_user: user,
                        },
                    }))
                    clearByName('courier_user_uuid')
                }}
                value={courier_user}
                size="small"
                textFieldProps={{
                    required: true,
                    margin: 'dense',
                    label: 'Pengangkut',
                    error: Boolean(validationErrors.courier_user_uuid),
                    helperText: validationErrors.courier_user_uuid,
                }}
            />

            <TextField
                disabled={disabled}
                fullWidth
                required
                margin="dense"
                label="NO. Kendaraan"
                size="small"
                name="vehicle_no"
                inputProps={{
                    minLength: 3,
                    maxLength: 11,
                }}
                onChange={clearByEvent}
                defaultValue={vehicle_no}
                error={Boolean(validationErrors.vehicle_no)}
                helperText={validationErrors.vehicle_no}
            />
        </>
    )
}

export default PalmBunchesReaDeliveryMainInputs
