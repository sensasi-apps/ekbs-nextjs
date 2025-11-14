// vendors

// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import dayjs, { type Dayjs } from 'dayjs'
import { memo, useEffect, useState } from 'react'
import { type NumberFormatValues, NumericFormat } from 'react-number-format'
import DatePicker from '@/components/date-picker'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/user-autocomplete'
import PalmBunch from '@/enums/permissions/PalmBunch'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// components
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
// modules
import type MinimalUser from '@/modules/user/types/minimal-user'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// libs
import { wholeNumber } from '@/utils/regexs'
import AsFarmLandIdInput from './MainInputs/AsFarmLandIdInput'
import SpbNoInput from './MainInputs/SpbNoInput'

interface MainInputProps {
    clearByName: (name: string) => void
    validationErrors: LaravelValidationExceptionResponse['errors']
    disabled: boolean
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
let tempData: any

// TODO: prevent rerender make input atomic
function PalmBunchesReaDeliveryMainInputs({
    clearByName,
    validationErrors,
    disabled,
}: MainInputProps) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { data, setData } = useFormData<PalmBunchesReaTicketORM>()

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
    const [courierUser, setCourierUser] = useState<MinimalUser | undefined>(
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
        value: string | Dayjs | number | undefined,
    ) => {
        tempData = { ...data }

        clearByName(key)
        tempData[key] = value ?? undefined
    }

    const handleDeliveryChange = (
        key: string,
        value: string | number | undefined | MinimalUser,
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
            <Typography component="h2" gutterBottom variant="h6">
                Data Pengangkutan
            </Typography>

            {data.id && (
                <TextField
                    disabled
                    label="ID"
                    margin={undefined}
                    required={false}
                    sx={{
                        mb: 2,
                    }}
                    value={data.id}
                    variant="filled"
                    {...errorsToHelperTextObj(validationErrors.id)}
                />
            )}

            <DatePicker
                disabled={disabled}
                label="Tanggal"
                maxDate={dayjs().add(1, 'day')}
                minDate={dayjs().subtract(3, 'month')}
                onAccept={handleBlur}
                onChange={value => {
                    setAt(value)
                    handleChange('at', value?.format('YYYY-MM-DD'))
                }}
                showDaysOutsideCurrentMonth
                slotProps={{
                    textField: {
                        error: Boolean(validationErrors.at),
                        helperText: validationErrors.at,
                        label: 'TGL',
                        name: 'at',
                    },
                }}
                value={at ?? null}
            />

            <SpbNoInput
                clearByName={clearByName}
                disabled={disabled}
                validationErrors={validationErrors}
            />

            <TextField
                disabled={disabled}
                inputProps={{
                    maxLength: 10,
                    minLength: 10,
                }}
                label="No. Tiket"
                name="ticket_no"
                onBlur={handleBlur}
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setTicketNo(value)
                    handleChange(name, value)
                }}
                value={ticketNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.ticket_no)}
            />

            <TextField
                disabled={disabled}
                inputProps={{
                    maxLength: 12,
                    minLength: 12,
                }}
                label="No. Gradis"
                name="gradis_no"
                onBlur={handleBlur}
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setGradisNo(value)
                    handleChange(name, value)
                }}
                value={gradisNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.gradis_no)}
            />

            <TextField
                disabled={disabled}
                inputProps={{
                    maxLength: 12,
                    minLength: 12,
                }}
                label="No. VeBeWe"
                name="vebewe_no"
                onBlur={handleBlur}
                onChange={event => {
                    const { name, value } = event.target

                    if (value != '' && !wholeNumber.test(value)) return

                    setVebeweNo(value)
                    handleChange(name, value)
                }}
                value={vebeweNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.vebewe_no)}
            />

            <Grid columnSpacing={2} container>
                <Grid item sm={6} xs={12}>
                    <Autocomplete
                        disabled={disabled}
                        disablePortal
                        fullWidth
                        onBlur={handleBlur}
                        onChange={(_, value) => {
                            setToOilMillCode(value ?? undefined)
                            handleDeliveryChange(
                                'to_oil_mill_code',
                                value ?? undefined,
                            )
                        }}
                        options={['COM', 'SOM', 'POM']}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Pabrik Tujuan"
                                name="to_oil_mill_code"
                                {...errorsToHelperTextObj(
                                    validationErrors.to_oil_mill_code,
                                )}
                            />
                        )}
                        value={toOilMillCode ?? null}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <Autocomplete
                        disabled={disabled}
                        disablePortal
                        fullWidth
                        onBlur={handleBlur}
                        onChange={(_, value) => {
                            setFromPosition(value ?? undefined)
                            handleDeliveryChange(
                                'from_position',
                                value ?? undefined,
                            )
                        }}
                        options={['Atas', 'Tengah', 'Bawah', 'Lainnya']}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Dari Posisi"
                                name="from_position"
                                {...errorsToHelperTextObj(
                                    validationErrors.from_position,
                                )}
                            />
                        )}
                        value={fromPosition ?? null}
                    />
                </Grid>
            </Grid>

            {fromPosition === 'Lainnya' && (
                <NumericFormat
                    allowNegative={false}
                    customInput={TextField}
                    decimalScale={0}
                    disabled={disabled}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">/kg</InputAdornment>
                        ),
                        startAdornment: <RpInputAdornment />,
                    }}
                    inputProps={{
                        maxLength: 3,
                        minLength: 1,
                    }}
                    label="Tarif angkut permintaan"
                    name="determined_rate_rp_per_kg"
                    onBlur={handleBlur}
                    onValueChange={values => {
                        setDeterminedRateRpPerKg(values.floatValue)
                        handleDeliveryChange(
                            'determined_rate_rp_per_kg',
                            values.floatValue,
                        )
                    }}
                    value={determinedRateRpPerKg ?? ''}
                    {...errorsToHelperTextObj(
                        validationErrors.determined_rate_rp_per_kg,
                    )}
                />
            )}

            <input name="n_bunches" type="hidden" value={nBunches ?? ''} />

            <NumericFormat
                allowNegative={false}
                customInput={TextField}
                decimalScale={0}
                decimalSeparator=","
                disabled={disabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">Janjang</InputAdornment>
                    ),
                }}
                inputProps={{
                    maxLength: 5,
                    minLength: 1,
                }}
                label="Total Janjang"
                onBlur={handleBlur}
                onValueChange={(values: NumberFormatValues) => {
                    setNBunches(values.floatValue)
                    handleDeliveryChange('n_bunches', values.floatValue)
                }}
                thousandSeparator="."
                value={nBunches ?? ''}
                {...errorsToHelperTextObj(validationErrors.n_bunches)}
            />

            <input
                name="courier_user_uuid"
                type="hidden"
                value={courierUser?.uuid || ''}
            />

            {isAuthHasPermission(PalmBunch.SEARCH_USER) ? (
                <UserAutocomplete
                    disabled={disabled}
                    fullWidth
                    label="Pengangkut"
                    onBlur={handleBlur}
                    onChange={(_, user) => {
                        setCourierUser(user ?? undefined)
                        handleDeliveryChange('courier_user', user ?? undefined)
                    }}
                    slotProps={{
                        textField: {
                            margin: 'dense',
                        },
                        ...errorsToHelperTextObj(
                            validationErrors.courier_user_uuid,
                        ),
                    }}
                    value={courierUser ?? null}
                />
            ) : (
                <Box my={1}>
                    <Typography component="div" variant="caption">
                        Pengangkut:
                    </Typography>
                    #{data.delivery?.courier_user?.id} —{' '}
                    {data.delivery?.courier_user?.name}
                </Box>
            )}

            <TextField
                disabled={disabled}
                inputProps={{
                    maxLength: 11,
                    minLength: 3,
                }}
                label="NO. Kendaraan"
                name="vehicle_no"
                onBlur={handleBlur}
                onChange={event => {
                    const { name, value } = event.target

                    setVehicleNo(
                        value.replaceAll(/[^a-z0-9]/gi, '').toUpperCase(),
                    )
                    handleDeliveryChange(name, value)
                }}
                value={vehicleNo ?? ''}
                {...errorsToHelperTextObj(validationErrors.vehicle_no)}
            />

            <AsFarmLandIdInput
                clearByName={clearByName}
                disabled={disabled}
                validationErrors={validationErrors}
            />
        </>
    )
}

export default memo(PalmBunchesReaDeliveryMainInputs)
