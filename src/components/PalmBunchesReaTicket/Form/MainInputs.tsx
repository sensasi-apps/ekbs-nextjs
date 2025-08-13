// vendors
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, memo, useState } from 'react'
import { NumericFormat, type NumberFormatValues } from 'react-number-format'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
// components
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'
import { type ValidationErrorsType } from '@/types/ValidationErrors'
import DatePicker from '@/components/DatePicker'
import UserAutocomplete from '@/components/UserAutocomplete'
import TextField from '@/components/TextField'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// providers
import useFormData from '@/providers/useFormData'
import type UserType from '@/features/user/types/user'
import SpbNoInput from './MainInputs/SpbNoInput'
import AsFarmLandIdInput from './MainInputs/AsFarmLandIdInput'
// libs
import { wholeNumber } from '@/utils/regexs'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import PalmBunch from '@/enums/permissions/PalmBunch'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

interface MainInputProps {
    clearByName: (name: string) => void
    validationErrors: ValidationErrorsType
    disabled: boolean
}

// TODO: remove any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tempData: any

// TODO: prevent rerender make input atomic
function PalmBunchesReaDeliveryMainInputs({
    clearByName,
    validationErrors,
    disabled,
}: MainInputProps) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { data, setData } = useFormData<PalmBunchesReaTicket>()

    // ticket props
    const [at, setAt] = useState(data.at ? dayjs(data.at) : null)
    const [ticketNo, setTicketNo] = useState(data.ticket_no)
    const [gradisNo, setGradisNo] = useState(data.gradis_no)
    const [vebeweNo, setVebeweNo] = useState(data.vebewe_no)

    // delivery props
    const [nBunches, setNBunches] = useState<number | undefined>(
        data.delivery?.n_bunches,
    )
    const [toOilMillCode, setToOilMillCode] = useState<string | undefined>(
        data.delivery?.to_oil_mill_code,
    )
    const [fromPosition, setFromPosition] = useState<string | undefined>(
        data.delivery?.from_position,
    )
    const [courierUser, setCourierUser] = useState<UserType | undefined>(
        data.delivery?.courier_user,
    )
    const [vehicleNo, setVehicleNo] = useState(data.delivery?.vehicle_no)

    const [determinedRateRpPerKg, setDeterminedRateRpPerKg] = useState<number>()

    useEffect(() => {
        tempData = structuredClone(data)

        return () => {
            tempData = undefined
        }
    }, [data])

    useEffect(() => {
        setAt(data.at ? dayjs(data.at) : null)
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

    useEffect(() => {
        setDeterminedRateRpPerKg(data.delivery?.determined_rate_rp_per_kg)
    }, [data.delivery?.determined_rate_rp_per_kg])

    const handleChange = (
        key: string,
        value: string | Dayjs | number | undefined | UserType,
    ) => {
        tempData = { ...data }

        clearByName(key)
        tempData[key] = value ?? undefined
    }

    const handleDeliveryChange = (
        key: string,
        value: string | number | undefined | UserType,
    ) => {
        clearByName(key)

        tempData = { ...data }

        if (tempData.delivery === undefined) {
            tempData.delivery = {}
        }

        tempData.delivery[key] = value ?? undefined
    }

    const handleBlur = () =>
        data.id ? null : setData(structuredClone(tempData))

    return (
        <>
            <Typography variant="h6" component="h2" gutterBottom>
                Data Pengangkutan
            </Typography>

            {data.id && (
                <TextField
                    disabled
                    margin={undefined}
                    required={false}
                    variant="filled"
                    sx={{
                        mb: 2,
                    }}
                    label="ID"
                    value={data.id}
                    {...errorsToHelperTextObj(validationErrors.id)}
                />
            )}

            <DatePicker
                maxDate={dayjs().add(1, 'day')}
                minDate={dayjs().subtract(3, 'month')}
                showDaysOutsideCurrentMonth
                disabled={disabled}
                label="Tanggal"
                slotProps={{
                    textField: {
                        name: 'at',
                        label: 'TGL',
                        error: Boolean(validationErrors.at),
                        helperText: validationErrors.at,
                    },
                }}
                value={at ?? null}
                onChange={value => {
                    setAt(value)
                    handleChange('at', value?.format('YYYY-MM-DD'))
                }}
                onAccept={handleBlur}
            />

            <SpbNoInput
                disabled={disabled}
                clearByName={clearByName}
                validationErrors={validationErrors}
            />

            <TextField
                inputProps={{
                    minLength: 10,
                    maxLength: 10,
                }}
                disabled={disabled}
                label="No. Tiket"
                name="ticket_no"
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setTicketNo(value)
                    handleChange(name, value)
                }}
                onBlur={handleBlur}
                value={ticketNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.ticket_no)}
            />

            <TextField
                disabled={disabled}
                label="No. Gradis"
                name="gradis_no"
                inputProps={{
                    minLength: 12,
                    maxLength: 12,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setGradisNo(value)
                    handleChange(name, value)
                }}
                onBlur={handleBlur}
                value={gradisNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.gradis_no)}
            />

            <TextField
                disabled={disabled}
                label="No. VeBeWe"
                name="vebewe_no"
                inputProps={{
                    minLength: 12,
                    maxLength: 12,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setVebeweNo(value)
                    handleChange(name, value)
                }}
                onBlur={handleBlur}
                value={vebeweNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.vebewe_no)}
            />

            <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={['COM', 'SOM', 'POM']}
                        disabled={disabled}
                        value={toOilMillCode ?? null}
                        onChange={(_, value) => {
                            setToOilMillCode(value ?? undefined)
                            handleDeliveryChange(
                                'to_oil_mill_code',
                                value ?? undefined,
                            )
                        }}
                        onBlur={handleBlur}
                        renderInput={params => (
                            <TextField
                                {...params}
                                name="to_oil_mill_code"
                                label="Pabrik Tujuan"
                                {...errorsToHelperTextObj(
                                    validationErrors.to_oil_mill_code,
                                )}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={['Atas', 'Tengah', 'Bawah', 'Lainnya']}
                        disabled={disabled}
                        value={fromPosition ?? null}
                        onChange={(_, value) => {
                            setFromPosition(value ?? undefined)
                            handleDeliveryChange(
                                'from_position',
                                value ?? undefined,
                            )
                        }}
                        onBlur={handleBlur}
                        renderInput={params => (
                            <TextField
                                {...params}
                                name="from_position"
                                label="Dari Posisi"
                                {...errorsToHelperTextObj(
                                    validationErrors.from_position,
                                )}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {fromPosition === 'Lainnya' && (
                <NumericFormat
                    customInput={TextField}
                    decimalScale={0}
                    allowNegative={false}
                    disabled={disabled}
                    label="Tarif angkut permintaan"
                    inputProps={{
                        maxLength: 3,
                        minLength: 1,
                    }}
                    InputProps={{
                        startAdornment: <RpInputAdornment />,
                        endAdornment: (
                            <InputAdornment position="end">/kg</InputAdornment>
                        ),
                    }}
                    onValueChange={values => {
                        setDeterminedRateRpPerKg(values.floatValue)
                        handleDeliveryChange(
                            'determined_rate_rp_per_kg',
                            values.floatValue,
                        )
                    }}
                    onBlur={handleBlur}
                    name="determined_rate_rp_per_kg"
                    value={determinedRateRpPerKg ?? ''}
                    {...errorsToHelperTextObj(
                        validationErrors.determined_rate_rp_per_kg,
                    )}
                />
            )}

            <input type="hidden" name="n_bunches" value={nBunches ?? ''} />

            <NumericFormat
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                disabled={disabled}
                label="Total Janjang"
                inputProps={{
                    minLength: 1,
                    maxLength: 5,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">Janjang</InputAdornment>
                    ),
                }}
                onValueChange={(values: NumberFormatValues) => {
                    setNBunches(values.floatValue)
                    handleDeliveryChange('n_bunches', values.floatValue)
                }}
                onBlur={handleBlur}
                value={nBunches ?? ''}
                {...errorsToHelperTextObj(validationErrors.n_bunches)}
            />

            <input
                type="hidden"
                name="courier_user_uuid"
                value={courierUser?.uuid || ''}
            />

            {isAuthHasPermission(PalmBunch.SEARCH_USER) ? (
                <UserAutocomplete
                    label="Pengangkut"
                    disabled={disabled}
                    showNickname
                    fullWidth
                    onChange={(_, user) => {
                        setCourierUser(user ?? undefined)
                        handleDeliveryChange('courier_user', user ?? undefined)
                    }}
                    onBlur={handleBlur}
                    value={courierUser ?? null}
                    size="small"
                    textFieldProps={{
                        required: true,
                        margin: 'dense',
                    }}
                    {...errorsToHelperTextObj(
                        validationErrors.courier_user_uuid,
                    )}
                />
            ) : (
                <Box my={1}>
                    <Typography variant="caption" component="div">
                        Pengangkut:
                    </Typography>
                    #{data.delivery?.courier_user?.id} —{' '}
                    {data.delivery?.courier_user?.name}
                </Box>
            )}

            <TextField
                disabled={disabled}
                label="NO. Kendaraan"
                name="vehicle_no"
                inputProps={{
                    minLength: 3,
                    maxLength: 11,
                }}
                onChange={event => {
                    const { name, value } = event.target

                    setVehicleNo(
                        value.replaceAll(/[^a-z0-9]/gi, '').toUpperCase(),
                    )
                    handleDeliveryChange(name, value)
                }}
                onBlur={handleBlur}
                value={vehicleNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.vehicle_no)}
            />

            <AsFarmLandIdInput
                disabled={disabled}
                validationErrors={validationErrors}
                clearByName={clearByName}
            />
        </>
    )
}

export default memo(PalmBunchesReaDeliveryMainInputs)
