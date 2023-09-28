import type { ChangeEvent } from 'react'
import type { NumberFormatValues } from 'react-number-format'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useEffect, useState } from 'react'

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

interface MainInputProps {
    clearByEvent: (event: ChangeEvent<HTMLInputElement>) => void
    clearByName: (name: string) => void
    validationErrors: ValidationErrorsType
    disabled: boolean
}

const DELIVERY_KEYS = [
    'to_oil_mill_code',
    'from_position',
    'n_bunches',
    'vehicle_no',
    'courier_user_uuid',
]

const PalmBunchesReaDeliveryMainInputs: FC<MainInputProps> = ({
    clearByEvent,
    clearByName,
    validationErrors,
    disabled,
}) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()
    const [localData, setLocalData] = useState(data)

    useEffect(() => {
        setLocalData(data)
    }, [data])

    const {
        id,
        at = null,
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
    } = localData

    const handleChange = (
        param:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | {
                  key: string
                  value: string | number | null | undefined
              },
    ) => {
        let key: string
        let value: string | number

        if ('target' in param) {
            clearByEvent(param as ChangeEvent<HTMLInputElement>)
            key = param.target.name
            value = param.target.value
        } else {
            clearByName(param.key)
            if (!param.value) return
            value = param.value
            key = param.key
        }

        let newDataTemp = {} as PalmBunchesReaTicketType

        if (DELIVERY_KEYS.includes(key)) {
            setLocalData(prev => {
                const delivery = {
                    ...prev.delivery,
                    [key]: value,
                }

                const newData = {
                    ...prev,
                    delivery,
                }

                newDataTemp = newData

                return newData
            })
        } else {
            setLocalData(prev => {
                const newData = {
                    ...prev,
                    [key]: value,
                }

                newDataTemp = newData

                return newData
            })
        }

        if (!newDataTemp) return

        setData({
            ...data,
            ...newDataTemp,
        })
    }

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
                value={at}
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
                onChange={value =>
                    handleChange({
                        key: 'at',
                        value: value?.format() || null,
                    })
                }
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 7,
                    maxLength: 7,
                    thousandSeparator: false,
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'spb_no',
                            value: values.floatValue,
                        }),
                }}
                value={spb_no}
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 10,
                    maxLength: 10,
                    thousandSeparator: false,
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'ticket_no',
                            value: values.floatValue,
                        }),
                }}
                value={ticket_no}
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
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'gradis_no',
                            value: values.floatValue,
                        }),
                }}
                value={gradis_no}
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
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'vebewe_no',
                            value: values.floatValue,
                        }),
                }}
                value={vebewe_no}
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
                        onChange={event => handleChange(event as any)}
                        selectProps={{
                            name: 'to_oil_mill_code',
                            value: to_oil_mill_code,
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
                            value: from_position,
                        }}
                        onChange={event => handleChange(event as any)}
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
                    inputComponent: NumericFormat,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 2,
                    maxLength: 6,
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'rp_per_kg',
                            value: values.floatValue,
                        }),
                }}
                value={rp_per_kg}
                error={Boolean(validationErrors.rp_per_kg)}
                helperText={validationErrors.rp_per_kg}
            />

            <input type="hidden" name="n_bunches" value={n_bunches} />

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
                    onValueChange: (values: NumberFormatValues) =>
                        handleChange({
                            key: 'n_bunches',
                            value: values.floatValue,
                        }),
                }}
                value={n_bunches}
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
                    setData({
                        ...data,
                        delivery: {
                            ...data.delivery,
                            courier_user_uuid: user?.uuid as any,
                            courier_user: user as any,
                        },
                    })
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
                onChange={handleChange}
                value={vehicle_no ?? ''}
                error={Boolean(validationErrors.vehicle_no)}
                helperText={validationErrors.vehicle_no}
            />
        </>
    )
}

export default PalmBunchesReaDeliveryMainInputs
