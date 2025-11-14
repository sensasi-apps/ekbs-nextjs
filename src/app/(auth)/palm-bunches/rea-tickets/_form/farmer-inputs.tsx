// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// vendors
import { memo, useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
// components
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/user-autocomplete'
import PalmBunch from '@/enums/permissions/PalmBunch'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import type PalmBunchORM from '@/modules/palm-bunch/types/orms/palm-bunch'
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
// providers
import useFormData from '@/providers/useFormData'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'

function PalmBunchesReaDeliveryFarmerInputs({
    disabled,
    validationErrors,
    clearByName,
}: {
    disabled: boolean
    validationErrors: LaravelValidationExceptionResponse['errors']
    clearByName: (name: string) => void
}) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const { data, setData } = useFormData<PalmBunchesReaTicketORM>()

    const [palmBunches, setPalmBunches] = useState<PalmBunchORM[]>(
        data.delivery?.palm_bunches ?? [{}],
    )

    useEffect(() => {
        setPalmBunches(data.delivery?.palm_bunches ?? [{}])
    }, [data])

    const handleChange = (index: number, newPalmBunch: PalmBunchORM) => {
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
            <Typography component="h2" mb={2} mt={3} variant="h6">
                Data Pemilik Buah
                <Tooltip arrow placement="top" title="Tambah Pemilik Buah">
                    <span>
                        <IconButton
                            color="success"
                            disabled={disabled}
                            onClick={() =>
                                setPalmBunches([
                                    ...palmBunches,
                                    {} as PalmBunchORM,
                                ])
                            }
                            size="small">
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            <Box display="flex" flexDirection="column" gap={2.5}>
                {palmBunches.map((palmBunch, index) => (
                    <Box display="flex" gap={1} key={palmBunch.uuid}>
                        <Tooltip
                            arrow
                            placement="top"
                            title="Hapus Pemilik Buah">
                            <span>
                                <IconButton
                                    color="error"
                                    disabled={disabled || index === 0}
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
                                    name={`palm_bunches[${index}][uuid]`}
                                    type="hidden"
                                    value={palmBunch.uuid || ''}
                                />

                                <input
                                    name={`palm_bunches[${index}][owner_user_uuid]`}
                                    type="hidden"
                                    value={palmBunch.owner_user_uuid || ''}
                                />

                                {isAuthHasPermission(PalmBunch.SEARCH_USER) ? (
                                    <UserAutocomplete
                                        disabled={disabled}
                                        fullWidth
                                        label="Nama"
                                        onBlur={handleBlur}
                                        onChange={(_, user) => {
                                            clearByName(
                                                `palm_bunches.${index}.owner_user_uuid`,
                                            )

                                            handleChange(index, {
                                                ...palmBunch,
                                                owner_user: user ?? undefined,
                                                owner_user_uuid: user?.uuid,
                                            })
                                        }}
                                        size="small"
                                        slotProps={{
                                            textField: {
                                                error: Boolean(
                                                    validationErrors[
                                                        `palm_bunches.${index}.owner_user_uuid`
                                                    ],
                                                ),
                                                helperText:
                                                    validationErrors[
                                                        `palm_bunches.${index}.owner_user_uuid`
                                                    ]?.join(', '),
                                            },
                                        }}
                                        value={palmBunch.owner_user || null}
                                    />
                                ) : (
                                    <Box>
                                        <Typography mr={1} variant="caption">
                                            Pemilik:
                                        </Typography>
                                        #{palmBunch.owner_user?.id} —{' '}
                                        {palmBunch.owner_user?.name}
                                    </Box>
                                )}
                            </Grid>
                            <Grid item sm xs={12}>
                                <TextField
                                    disabled={disabled}
                                    error={Boolean(
                                        validationErrors[
                                            `palm_bunches.${index}.land_desc`
                                        ],
                                    )}
                                    fullWidth
                                    helperText={
                                        validationErrors[
                                            `palm_bunches.${index}.land_desc`
                                        ]
                                    }
                                    label="Kebun"
                                    name={`palm_bunches[${index}][land_desc]`}
                                    onBlur={handleBlur}
                                    onChange={event => {
                                        clearByName(
                                            `palm_bunches.${index}.land_desc`,
                                        )
                                        handleChange(index, {
                                            ...palmBunch,
                                            land_desc: event.target.value,
                                        })
                                    }}
                                    size="small"
                                    value={palmBunch.land_desc ?? ''}
                                />
                            </Grid>
                            <Grid item sm xs={12}>
                                <SelectFromApi
                                    disabled={disabled}
                                    endpoint="/data/farmer-groups"
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
                                    label="Kelompok Tani"
                                    onBlur={handleBlur}
                                    onValueChange={value => {
                                        clearByName(
                                            `palm_bunches.${index}.uuid`,
                                        )
                                        handleChange(index, {
                                            ...palmBunch,
                                            farmer_group_uuid: value.uuid,
                                        })
                                    }}
                                    selectProps={{
                                        name: `palm_bunches[${index}][farmer_group_uuid]`,
                                        value:
                                            palmBunch.farmer_group_uuid || '',
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item sm xs={12}>
                                <input
                                    name={`palm_bunches[${index}][n_kg]`}
                                    type="hidden"
                                    value={palmBunch.n_kg || ''}
                                />

                                <NumericFormat
                                    allowNegative={false}
                                    customInput={TextField}
                                    decimalSeparator=","
                                    disabled={disabled}
                                    error={Boolean(validationErrors.n_kg)}
                                    fullWidth
                                    helperText={validationErrors.n_kg}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                kg
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{
                                        maxLength: 6,
                                        minLength: 1,
                                    }}
                                    label="Bobot"
                                    onBlur={handleBlur}
                                    onValueChange={({ floatValue }) => {
                                        clearByName(
                                            `palm_bunches.${index}.n_kg`,
                                        )

                                        handleChange(index, {
                                            ...palmBunch,
                                            n_kg: floatValue,
                                        })
                                    }}
                                    required
                                    size="small"
                                    thousandSeparator="."
                                    value={palmBunch.n_kg ?? ''}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>

            <Grid columnSpacing={2} container my={2}>
                <Grid item textAlign="right" xs={8}>
                    TOTAL BOBOT
                </Grid>

                <Grid fontWeight="bold" item textAlign="left" xs={4}>
                    <NumericFormat
                        displayType="text"
                        suffix=" kg"
                        value={
                            palmBunches.reduce(
                                (a, b) => a + (b.n_kg || 0),
                                0,
                            ) || 0
                        }
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(PalmBunchesReaDeliveryFarmerInputs)
