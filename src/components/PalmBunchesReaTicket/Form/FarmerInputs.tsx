// types
import type PalmBunchDataType from '@/dataTypes/PalmBunch'
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'
import { type ValidationErrorsType } from '@/types/ValidationErrors'
// vendors
import { useEffect, useState, memo } from 'react'
import { NumericFormat } from 'react-number-format'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// components
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/UserAutocomplete'
// providers
import useFormData from '@/providers/useFormData'
import PalmBunch from '@/enums/permissions/PalmBunch'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

function PalmBunchesReaDeliveryFarmerInputs({
    disabled,
    validationErrors,
    clearByName,
}: {
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByName: (name: string) => void
}) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const { data, setData } = useFormData<PalmBunchesReaTicket>()

    const [palmBunches, setPalmBunches] = useState<PalmBunchDataType[]>(
        data.delivery?.palm_bunches ?? [{}],
    )

    useEffect(() => {
        setPalmBunches(data.delivery?.palm_bunches ?? [{}])
    }, [data])

    const handleChange = (index: number, newPalmBunch: PalmBunchDataType) => {
        palmBunches[index] = newPalmBunch
        setPalmBunches([...palmBunches])
    }

    const handleBlur = () =>
        data.id
            ? null
            : setData({
                  ...data,
                  delivery: {
                      ...data.delivery,
                      palm_bunches: palmBunches,
                  },
              })

    return (
        <>
            <Typography variant="h6" component="h2" mt={3} mb={2}>
                Data Pemilik Buah
                <Tooltip title="Tambah Pemilik Buah" arrow placement="top">
                    <span>
                        <IconButton
                            disabled={disabled}
                            color="success"
                            size="small"
                            onClick={() =>
                                setPalmBunches([
                                    ...palmBunches,
                                    {} as PalmBunchDataType,
                                ])
                            }>
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            <Box display="flex" flexDirection="column" gap={2.5}>
                {palmBunches.map((palmBunch, index) => (
                    <Box display="flex" key={index} gap={1}>
                        <Tooltip
                            title="Hapus Pemilik Buah"
                            placement="top"
                            arrow>
                            <span>
                                <IconButton
                                    disabled={disabled || index === 0}
                                    color="error"
                                    onClick={() => {
                                        setPalmBunches(
                                            palmBunches.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }}>
                                    <RemoveCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
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

                                {isAuthHasPermission(PalmBunch.SEARCH_USER) ? (
                                    <UserAutocomplete
                                        label="Nama"
                                        showNickname
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
                                        onBlur={handleBlur}
                                        error={Boolean(
                                            validationErrors[
                                                `palm_bunches.${index}.owner_user_uuid`
                                            ],
                                        )}
                                        helperText={validationErrors[
                                            `palm_bunches.${index}.owner_user_uuid`
                                        ]?.join(', ')}
                                        textFieldProps={{
                                            required: true,
                                        }}
                                    />
                                ) : (
                                    <Box>
                                        <Typography variant="caption" mr={1}>
                                            Pemilik:
                                        </Typography>
                                        #{palmBunch.owner_user?.id} —{' '}
                                        {palmBunch.owner_user?.name}
                                    </Box>
                                )}
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
                                    onBlur={handleBlur}
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
                                        value:
                                            palmBunch.farmer_group_uuid || '',
                                    }}
                                    onValueChange={value => {
                                        clearByName(
                                            `palm_bunches.${index}.uuid`,
                                        )
                                        handleChange(index, {
                                            ...palmBunch,
                                            farmer_group_uuid: value.uuid,
                                        })
                                    }}
                                    onBlur={handleBlur}
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

                                <NumericFormat
                                    allowNegative={false}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    customInput={TextField}
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
                                    }}
                                    inputProps={{
                                        minLength: 1,
                                        maxLength: 6,
                                    }}
                                    onValueChange={({ floatValue }) => {
                                        clearByName(
                                            `palm_bunches.${index}.n_kg`,
                                        )

                                        handleChange(index, {
                                            ...palmBunch,
                                            n_kg: floatValue,
                                        })
                                    }}
                                    onBlur={handleBlur}
                                    value={palmBunch.n_kg ?? ''}
                                    error={Boolean(validationErrors.n_kg)}
                                    helperText={validationErrors.n_kg}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>

            <Grid container my={2} columnSpacing={2}>
                <Grid item xs={8} textAlign="right">
                    TOTAL BOBOT
                </Grid>

                <Grid item xs={4} textAlign="left" fontWeight="bold">
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
        </>
    )
}

export default memo(PalmBunchesReaDeliveryFarmerInputs)
