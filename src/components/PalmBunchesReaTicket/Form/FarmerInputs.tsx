import type { NumberFormatValues } from 'react-number-format'
import type PalmBunchDataType from '@/dataTypes/PalmBunch'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type ValidationErrorsType from '@/types/ValidationErrors'

import { FC, useEffect, useState, memo } from 'react'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import AddIcon from '@mui/icons-material/Add'

// components
import NumericFormat from '@/components/Global/NumericFormat'
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
// libs
import debounce from '@/lib/debounce'
// providers
import useFormData from '@/providers/useFormData'

const PalmBunchesReaDeliveryFarmerInputs: FC<{
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByName: (name: string) => void
}> = ({ disabled, validationErrors, clearByName }) => {
    const { data, setData } = useFormData<PalmBunchesReaTicketType>()

    const [palmBunches, setPalmBunches] = useState<PalmBunchDataType[]>(
        data.delivery?.palm_bunches ?? [{}],
    )

    useEffect(() => {
        setPalmBunches(data.delivery?.palm_bunches ?? [{}])
    }, [data])

    const handleChange = (index: number, newPalmBunch: PalmBunchDataType) => {
        palmBunches[index] = newPalmBunch

        debounce(
            () =>
                setData({
                    ...data,
                    delivery: {
                        ...data.delivery,
                        palm_bunches: palmBunches,
                    },
                }),
            200,
        )

        setPalmBunches([...palmBunches])
    }

    return (
        <>
            <Typography variant="h6" component="h2" mt={3} mb={2}>
                Data Pemilik Buah
            </Typography>

            <Grid container rowGap={3}>
                {palmBunches.map((palmBunch, index) => (
                    <Grid
                        item
                        key={index}
                        container
                        rowGap={1}
                        columnGap={2}
                        alignItems="center">
                        <Grid item xs={12} sm>
                            <input
                                type="hidden"
                                name={`palm_bunches[${index}][uuid]`}
                                value={palmBunch.uuid || ''}
                            />

                            <input
                                type="hidden"
                                name={`palm_bunches[${index}][owner_user_uuid]`}
                                value={palmBunch.owner_user_uuid || ''}
                            />

                            <UserAutocomplete
                                disabled={disabled}
                                fullWidth
                                onChange={(_, user) => {
                                    clearByName(
                                        `palm_bunches.${index}.owner_user_uuid`,
                                    )

                                    handleChange(index, {
                                        ...palmBunch,
                                        owner_user: user || undefined,
                                        owner_user_uuid:
                                            user?.uuid || undefined,
                                    })
                                }}
                                value={palmBunch.owner_user || null}
                                size="small"
                                textFieldProps={{
                                    required: true,
                                    label: 'Nama',
                                    error: Boolean(
                                        validationErrors[
                                            `palm_bunches.${index}.owner_user_uuid`
                                        ],
                                    ),
                                    helperText:
                                        validationErrors[
                                            `palm_bunches.${index}.owner_user_uuid`
                                        ]?.join(', '),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Kebun"
                                size="small"
                                name={`palm_bunches[${index}][land_desc]`}
                                onChange={event => {
                                    clearByName(
                                        `palm_bunches.${index}.land_desc`,
                                    )
                                    handleChange(index, {
                                        ...palmBunch,
                                        land_desc: event.target.value,
                                    })
                                }}
                                value={palmBunch.land_desc ?? ''}
                                error={Boolean(
                                    validationErrors[
                                        `palm_bunches.${index}.land_desc`
                                    ],
                                )}
                                helperText={
                                    validationErrors[
                                        `palm_bunches.${index}.land_desc`
                                    ]
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <SelectFromApi
                                endpoint="/data/farmer-groups"
                                label="Kelompok Tani"
                                size="small"
                                disabled={disabled}
                                selectProps={{
                                    name: `palm_bunches[${index}][farmer_group_uuid]`,
                                    value: palmBunch.farmer_group_uuid || '',
                                }}
                                onValueChange={value => {
                                    clearByName(`palm_bunches.${index}.uuid`)
                                    handleChange(index, {
                                        ...palmBunch,
                                        farmer_group_uuid: value.uuid,
                                    })
                                }}
                                error={Boolean(
                                    validationErrors[
                                        `palm_bunches.${index}.farmer_group_uuid`
                                    ],
                                )}
                                helperText={
                                    validationErrors[
                                        `palm_bunches.${index}.farmer_group_uuid`
                                    ]
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <input
                                type="hidden"
                                name={`palm_bunches[${index}][n_kg]`}
                                value={palmBunch.n_kg || ''}
                            />

                            <TextField
                                disabled={disabled}
                                fullWidth
                                required
                                label="Bobot"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kg
                                        </InputAdornment>
                                    ),
                                    inputComponent: NumericFormat,
                                }}
                                inputProps={{
                                    allowNegative: false,
                                    onValueChange: (
                                        values: NumberFormatValues,
                                    ) => {
                                        clearByName(
                                            `palm_bunches.${index}.n_kg`,
                                        )

                                        handleChange(index, {
                                            ...palmBunch,
                                            n_kg: values.floatValue,
                                        })
                                    },
                                }}
                                value={palmBunch.n_kg ?? ''}
                                error={Boolean(validationErrors.n_kg)}
                                helperText={validationErrors.n_kg}
                            />
                        </Grid>

                        {index !== 0 && index === palmBunches.length - 1 && (
                            <Grid item xs={12} sm={1}>
                                <Button
                                    disabled={disabled}
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    fullWidth
                                    onClick={() => {
                                        setPalmBunches(
                                            palmBunches.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }}>
                                    Hapus
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                ))}

                <Grid item container my={1}>
                    <Grid item xs={9} textAlign="center" fontWeight="bold">
                        TOTAL
                    </Grid>
                    <Grid
                        item
                        xs={3}
                        textAlign="right"
                        fontWeight="bold"
                        pr={1}>
                        <NumericFormat
                            value={
                                palmBunches.reduce(
                                    (a, b) => a + (b.n_kg || 0),
                                    0,
                                ) || 0
                            }
                            suffix=" kg"
                            displayType="text"
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        size="small"
                        disabled={disabled}
                        startIcon={<AddIcon />}
                        color="success"
                        onClick={() =>
                            setPalmBunches([
                                ...palmBunches,
                                {} as PalmBunchDataType,
                            ])
                        }>
                        Tambah Pemilik Buah
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default memo(PalmBunchesReaDeliveryFarmerInputs)
