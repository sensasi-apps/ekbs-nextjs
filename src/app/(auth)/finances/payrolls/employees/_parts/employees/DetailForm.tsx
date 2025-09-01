// types
import type { FastFieldProps, FieldProps, FormikProps } from 'formik'
import type PayrollUser from '@/dataTypes/PayrollUser'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vendors
import { FastField, Field, FieldArray } from 'formik'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
// icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// components
import FormikForm from '@/components/formik-form'
import FlexColumnBox from '@/components/FlexColumnBox'
import InfoBox from '@/components/InfoBox'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import debounce from '@/utils/debounce'

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
            id="employee-details-form"
            autoComplete="off"
            isNew={false}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                deleteButton: {
                    disabled: isDisabled,
                    loading: isDeleting,
                    onClick: handleDelete,
                },
            }}>
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
                <FormHelperText error component="div">
                    {Object.values(errors).map((error, i) => (
                        <Box key={i}>{error}</Box>
                    ))}
                </FormHelperText>
            )}

            <FieldArray
                name="details"
                render={({ remove, push, swap }) => (
                    <>
                        <FlexColumnBox mt={2} gap={1}>
                            {details?.map((detail, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    gap={1}
                                    alignItems="center">
                                    <FlexColumnBox gap={undefined}>
                                        <IconButton
                                            size="small"
                                            disabled={index === 0 || isDisabled}
                                            onClick={() =>
                                                swap(index, index - 1)
                                            }
                                            color="info"
                                            sx={{
                                                p: 0,
                                            }}>
                                            <KeyboardArrowUpIcon />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            disabled={
                                                index === details.length - 1 ||
                                                isDisabled
                                            }
                                            onClick={() =>
                                                swap(index, index + 1)
                                            }
                                            color="info"
                                            sx={{
                                                p: 0,
                                            }}>
                                            <KeyboardArrowDownIcon />
                                        </IconButton>
                                    </FlexColumnBox>

                                    <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                        flexGrow="1">
                                        <Grid size={{ xs: 6 }}>
                                            <FastField
                                                name={`details.${index}.name`}>
                                                {({
                                                    field: { name, value },
                                                    form: { setFieldValue },
                                                }: FastFieldProps<string>) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        size="small"
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
                                                        value={value}
                                                        disabled={
                                                            isDisabled ||
                                                            Boolean(
                                                                detail.payroll_user_detailable_id,
                                                            )
                                                        }
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                margin="none"
                                                                label="Nama"
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
                                                        label="Nilai (Rp)"
                                                        name={name}
                                                        margin="none"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <RpInputAdornment />
                                                            ),
                                                        }}
                                                        disabled={
                                                            isDisabled ||
                                                            Boolean(
                                                                detail.payroll_user_detailable_id,
                                                            )
                                                        }
                                                        value={value}
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
                                            size="small"
                                            onClick={() => remove(index)}
                                            disabled={
                                                isDisabled ||
                                                Boolean(
                                                    detail.payroll_user_detailable_id,
                                                )
                                            }
                                            color="error">
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
                            variant="contained"
                            disabled={isDisabled}
                            fullWidth
                            color="success"
                            size="small"
                            startIcon={<AddCircleIcon />}
                            onClick={() =>
                                push({
                                    name:
                                        'Rincian ' +
                                        ((details?.length ?? 0) + 1),
                                    amount_rp: 0,
                                })
                            }>
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
