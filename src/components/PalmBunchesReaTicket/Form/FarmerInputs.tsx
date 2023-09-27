import { FC, useState } from 'react'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import AddIcon from '@mui/icons-material/Add'

import NumericFormat from '@/components/Global/NumericFormat'
import SelectFromApi from '@/components/Global/SelectFromApi'
import UserAutocomplete from '@/components/Global/UserAutocomplete'

import PalmBunchDataType from '@/dataTypes/PalmBunch'
import type ValidationErrorsType from '@/types/ValidationErrors'

const PalmBunchesReaDeliveryFarmerInputs: FC<{
    data?: PalmBunchDataType[]
    disabled: boolean
    validationErrors: ValidationErrorsType
    clearByEvent: (event: React.ChangeEvent<HTMLInputElement>) => void
    clearByName: (name: string) => void
}> = ({
    data: palmBunchesProp,
    disabled,
    validationErrors,
    clearByEvent,
    clearByName,
}) => {
    const [palmBunches, setPalmBunches] = useState<PalmBunchDataType[]>(
        palmBunchesProp || [{} as PalmBunchDataType],
    )

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
                                onChange={(_: any, user: any) => {
                                    setPalmBunches(
                                        palmBunches.map((palmBunch, i) => {
                                            if (i === index) {
                                                return {
                                                    ...palmBunch,
                                                    owner_user_uuid: user?.uuid,
                                                }
                                            }
                                            return palmBunch
                                        }),
                                    )

                                    clearByName(
                                        `palm_bunches.${index}.owner_user_uuid`,
                                    )
                                }}
                                defaultValue={palmBunch.owner_user || null}
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
                                onChange={() =>
                                    clearByName(
                                        `palm_bunches.${index}.land_desc`,
                                    )
                                }
                                defaultValue={palmBunch.land_desc}
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
                                defaultValue={palmBunch.farmer_group_uuid || ''}
                                selectProps={{
                                    name: `palm_bunches[${index}][farmer_group_uuid]`,
                                }}
                                onChange={clearByEvent}
                                error={Boolean(
                                    validationErrors.farmer_group_uuid,
                                )}
                                helperText={validationErrors.farmer_group_uuid}
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
                                    inputComponent: NumericFormat as any,
                                }}
                                inputProps={{
                                    allowNegative: false,
                                    onValueChange: (values: any) => {
                                        document
                                            .querySelector(
                                                `input[name="palm_bunches[${index}][n_kg]"]`,
                                            )
                                            ?.setAttribute(
                                                'value',
                                                values.floatValue,
                                            )

                                        setPalmBunches(
                                            palmBunches.map((palmBunch, i) => {
                                                if (i === index) {
                                                    return {
                                                        ...palmBunch,
                                                        n_kg: values.floatValue,
                                                    }
                                                }
                                                return palmBunch
                                            }),
                                        )
                                    },
                                }}
                                defaultValue={palmBunch.n_kg}
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

export default PalmBunchesReaDeliveryFarmerInputs
