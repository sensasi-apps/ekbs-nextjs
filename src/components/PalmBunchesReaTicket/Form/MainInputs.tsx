import type { NumberFormatValues } from 'react-number-format'
import type { Moment } from 'moment'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useEffect, memo, useState } from 'react'
import moment from 'moment'

import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// components
import DatePicker from '@/components/Global/DatePicker'
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
import NumericFormat from '@/components/Global/NumericFormat'
// providers
import useFormData from '@/providers/useFormData'
import UserType from '@/dataTypes/User'
import debounce from '@/lib/debounce'
import SpbNoInput from './MainInputs/SpbNoInput'

interface MainInputProps {
    clearByName: (name: string) => void
    validationErrors: ValidationErrorsType
    disabled: boolean
}

let tempData: any

// TODO: prevent rerender make input atomic
const PalmBunchesReaDeliveryMainInputs: FC<MainInputProps> = ({
    clearByName,
    validationErrors,
    disabled,
}) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()

    // ticket props
    const [at, setAt] = useState<Moment | undefined>(
        data.at ? moment(data.at) : undefined,
    )
    const [ticketNo, setTicketNo] = useState(data.ticket_no)
    const [gradisNo, setGradisNo] = useState(data.gradis_no)
    const [vebeweNo, setVebeweNo] = useState(data.vebewe_no)
    const [rpPerKg, setRpPerKg] = useState<number | undefined>(data.rp_per_kg)

    // delivery props
    const [nBunches, setNBunches] = useState<number | undefined>(
        data.delivery?.n_bunches,
    )
    const [toOilMillCode, setToOilMillCode] = useState(
        data.delivery?.to_oil_mill_code,
    )
    const [fromPosition, setFromPosition] = useState(
        data.delivery?.from_position,
    )
    const [courierUser, setCourierUser] = useState<UserType | undefined>(
        data.delivery?.courier_user,
    )
    const [vehicleNo, setVehicleNo] = useState(data.delivery?.vehicle_no)

    useEffect(() => {
        tempData = {}

        return () => {
            tempData = undefined
        }
    }, [data])

    useEffect(() => {
        setAt(data.at ? moment(data.at) : undefined)
    }, [data.at])

    useEffect(() => {
        setTicketNo(data.ticket_no)
    }, [data.ticket_no])

    useEffect(() => {
        setGradisNo(data.gradis_no)
    }, [data.gradis_no])

    useEffect(() => {
        setVebeweNo(data.vebewe_no)
    }, [data.vebewe_no])

    useEffect(() => {
        setRpPerKg(data.rp_per_kg)
    }, [data.rp_per_kg])

    useEffect(() => {
        setNBunches(data.delivery?.n_bunches)
    }, [data.delivery?.n_bunches])

    useEffect(() => {
        setToOilMillCode(data.delivery?.to_oil_mill_code)
    }, [data.delivery?.to_oil_mill_code])

    useEffect(() => {
        setFromPosition(data.delivery?.from_position)
    }, [data.delivery?.from_position])

    useEffect(() => {
        setCourierUser(data.delivery?.courier_user)
    }, [data.delivery?.courier_user])

    useEffect(() => {
        setVehicleNo(data.delivery?.vehicle_no)
    }, [data.delivery?.vehicle_no])

    const handleChange = (
        key: string,
        value: string | Moment | number | undefined | UserType,
    ) => {
        clearByName(key)
        tempData[key] = value ?? undefined

        debounce(() => {
            setData({
                ...data,
                ...tempData,
            })
        }, 250)
    }

    const { id } = data

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
                value={at ?? null}
                onChange={value => {
                    setAt(value ?? undefined)
                    handleChange('at', value?.format('YYYY-MM-DD'))
                }}
            />

            <SpbNoInput
                disabled={disabled}
                clearByName={clearByName}
                validationErrors={validationErrors}
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 10,
                    maxLength: 10,
                    thousandSeparator: false,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    setTicketNo(value)
                    handleChange(name, value)
                }}
                value={ticketNo ?? ''}
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    thousandSeparator: false,
                    minLength: 12,
                    maxLength: 12,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    setGradisNo(value)
                    handleChange(name, value)
                }}
                value={gradisNo ?? ''}
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 12,
                    maxLength: 12,
                    thousandSeparator: false,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    setVebeweNo(value)
                    handleChange(name, value)
                }}
                value={vebeweNo ?? ''}
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
                        selectProps={{
                            name: 'to_oil_mill_code',
                            value: toOilMillCode ?? '',
                        }}
                        onChange={event => {
                            const { name, value } =
                                event.target as HTMLInputElement

                            setToOilMillCode(value)
                            handleChange(name, value)
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
                        selectProps={{
                            name: 'from_position',
                            value: fromPosition ?? '',
                        }}
                        onChange={event => {
                            const { name, value } =
                                event.target as HTMLInputElement

                            setFromPosition(value as string)
                            handleChange(name, value)
                        }}
                        error={Boolean(validationErrors.from_position)}
                        helperText={validationErrors.from_position}
                    />
                </Grid>
            </Grid>

            <input type="hidden" name="rp_per_kg" value={rpPerKg ?? ''} />

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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 2,
                    maxLength: 6,
                    onValueChange: (values: NumberFormatValues) => {
                        setRpPerKg(values.floatValue)
                        handleChange('rp_per_kg', values.floatValue)
                    },
                }}
                value={rpPerKg ?? ''}
                error={Boolean(validationErrors.rp_per_kg)}
                helperText={validationErrors.rp_per_kg}
            />

            <input type="hidden" name="n_bunches" value={nBunches ?? ''} />

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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    maxLength: 10,
                    onValueChange: (values: NumberFormatValues) => {
                        setNBunches(values.floatValue)
                        handleChange('n_bunches', values.floatValue)
                    },
                }}
                value={nBunches ?? ''}
                error={Boolean(validationErrors.n_bunches)}
                helperText={validationErrors.n_bunches}
            />

            <input
                type="hidden"
                name="courier_user_uuid"
                value={courierUser?.uuid || ''}
            />

            <UserAutocomplete
                disabled={disabled}
                fullWidth
                onChange={(_, user) => {
                    setCourierUser(user ?? undefined)
                    handleChange('courier_user', user ?? undefined)
                }}
                value={courierUser ?? null}
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
                onChange={event => {
                    const { name, value } = event.target

                    setVehicleNo(event.target.value)
                    handleChange(name, value)
                }}
                value={vehicleNo ?? ''}
                error={Boolean(validationErrors.vehicle_no)}
                helperText={validationErrors.vehicle_no}
            />
        </>
    )
}

export default memo(PalmBunchesReaDeliveryMainInputs)
