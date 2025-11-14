// types

import AddCircleIcon from '@mui/icons-material/AddCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import type { FastFieldProps, FieldProps, FormikProps } from 'formik'
// vendors
import { FastField, Field, FieldArray } from 'formik'
import FlexColumnBox from '@/components/flex-column-box'
// components
import FormikForm from '@/components/formik-form'
import InfoBox from '@/components/info-box'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type PayrollUser from '@/types/orms/payroll-user'
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function PayrollEmployeeDetailsForm({
    values: { details },
    status: { user_state },
    errors,
    dirty,
    isSubmitting,
    handleDelete,
    isDeleting,
}: FormikProps<FormikValues> & {
    handleDelete: () => void
    isDeleting: boolean
}) {
    const isPropcessing = isSubmitting || isDeleting
    const isDisabled = isPropcessing

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="employee-details-form"
            isNew={false}
            processing={isPropcessing}
            slotProps={{
                deleteButton: {
                    disabled: isDisabled,
                    loading: isDeleting,
                    onClick: handleDelete,
                },
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <InfoBox
                data={[
                    {
                        label: 'Nama',
                        value: user_state?.name ?? '-',
                    },
                    {
                        label: 'Jabatan',
                        value: user_state?.employee?.position ?? '-',
                    },
                    {
                        label: 'Total Bersih',
                        value: numberToCurrency(
                            details?.reduce(
                                (a, b) =>
                                    a +
                                    parseFloat(
                                        (b.amount_rp as unknown as string) ?? 0,
                                    ),
                                0,
                            ) ?? 0,
                        ),
                    },
                ]}
            />

            {errors && (
                <FormHelperText component="div" error>
                    {Object.values(errors).map(error => (
                        <Box key={error}>{error}</Box>
                    ))}
                </FormHelperText>
            )}

            <FieldArray
                name="details"
                render={({ remove, push, swap }) => (
                    <>
                        <FlexColumnBox gap={1} mt={2}>
                            {details?.map((detail, index) => (
                                <Box
                                    alignItems="center"
                                    display="flex"
                                    gap={1}
                                    key={detail.uuid}>
                                    <FlexColumnBox gap={undefined}>
                                        <IconButton
                                            color="info"
                                            disabled={index === 0 || isDisabled}
                                            onClick={() =>
                                                swap(index, index - 1)
                                            }
                                            size="small"
                                            sx={{
                                                p: 0,
                                            }}>
                                            <KeyboardArrowUpIcon />
                                        </IconButton>

                                        <IconButton
                                            color="info"
                                            disabled={
                                                index === details.length - 1 ||
                                                isDisabled
                                            }
                                            onClick={() =>
                                                swap(index, index + 1)
                                            }
                                            size="small"
                                            sx={{
                                                p: 0,
                                            }}>
                                            <KeyboardArrowDownIcon />
                                        </IconButton>
                                    </FlexColumnBox>

                                    <Grid
                                        alignItems="center"
                                        container
                                        flexGrow="1"
                                        spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <FastField
                                                name={`details.${index}.name`}>
                                                {({
                                                    field: { name, value },
                                                    form: { setFieldValue },
                                                }: FastFieldProps<string>) => (
                                                    <Autocomplete
                                                        disabled={
                                                            isDisabled ||
                                                            Boolean(
                                                                detail.payroll_user_detailable_id,
                                                            )
                                                        }
                                                        freeSolo
                                                        options={[
                                                            'Gaji Pokok',
                                                            'T. Jabatan',
                                                            'T. Transportasi',
                                                            'T. Makan',
                                                            'T. Komunikasi',
                                                            'SPP',
                                                            'Arisan',
                                                            'PPh 21',
                                                            'Lembur',
                                                        ]}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label="Nama"
                                                                margin="none"
                                                                name={name}
                                                                onChange={({
                                                                    target,
                                                                }) =>
                                                                    debounce(
                                                                        () =>
                                                                            setFieldValue(
                                                                                name,
                                                                                target.value,
                                                                            ),
                                                                    )
                                                                }
                                                                {...errorsToHelperTextObj(
                                                                    (
                                                                        errors as LaravelValidationException['errors']
                                                                    )[
                                                                        `details.${index}.name`
                                                                    ],
                                                                )}
                                                            />
                                                        )}
                                                        size="small"
                                                        value={value}
                                                    />
                                                )}
                                            </FastField>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Field
                                                name={`details.${index}.amount_rp`}>
                                                {({
                                                    field: { value, name },
                                                    form: { setFieldValue },
                                                }: FieldProps) => (
                                                    <NumericFormat
                                                        allowNegative
                                                        disabled={
                                                            isDisabled ||
                                                            Boolean(
                                                                detail.payroll_user_detailable_id,
                                                            )
                                                        }
                                                        InputProps={{
                                                            startAdornment: (
                                                                <RpInputAdornment />
                                                            ),
                                                        }}
                                                        label="Nilai (Rp)"
                                                        margin="none"
                                                        name={name}
                                                        onValueChange={({
                                                            floatValue,
                                                        }) =>
                                                            debounce(() =>
                                                                setFieldValue(
                                                                    name,
                                                                    floatValue,
                                                                ),
                                                            )
                                                        }
                                                        value={value}
                                                        {...errorsToHelperTextObj(
                                                            (
                                                                errors as LaravelValidationException['errors']
                                                            )[name],
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                    </Grid>

                                    <span>
                                        <IconButton
                                            color="error"
                                            disabled={
                                                isDisabled ||
                                                Boolean(
                                                    detail.payroll_user_detailable_id,
                                                )
                                            }
                                            onClick={() => remove(index)}
                                            size="small">
                                            <RemoveCircleIcon />
                                        </IconButton>
                                    </span>
                                </Box>
                            ))}
                        </FlexColumnBox>

                        <Box mb={2}>
                            <FormHelperText>
                                Mulakan isian Nilai dengan tanda negatif (-)
                                untuk mengindikasikan potongan.
                            </FormHelperText>
                        </Box>

                        <Button
                            color="success"
                            disabled={isDisabled}
                            fullWidth
                            onClick={() =>
                                push({
                                    amount_rp: 0,
                                    name:
                                        'Rincian ' +
                                        ((details?.length ?? 0) + 1),
                                })
                            }
                            size="small"
                            startIcon={<AddCircleIcon />}
                            variant="contained">
                            Tambah Rincian
                        </Button>
                    </>
                )}
            />
        </FormikForm>
    )
}

export type FormikValues = {
    details?: PayrollUser['details']
}
