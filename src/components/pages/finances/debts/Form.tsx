// types

import type { UUID } from 'node:crypto'
// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import { Field, type FieldProps, type FormikProps } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import DateField from '@/components/formik-fields/date-field'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
// formik
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import InterestUnit from '@/modules/installment/enums/debt-interest-unit'
// enums
import TermUnit from '@/modules/installment/enums/debt-term-unit'
import type { Ymd } from '@/types/date-string'
import type Debt from '@/types/orms/debt'
import type DebtDetail from '@/types/orms/debt-detail'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import shortUuid from '@/utils/short-uuid'
import ucWords from '@/utils/uc-words'
// components
import DebtDetailsTable from './Form/DebtDetailsTable'

export default function FinancesDebtForm({
    dirty,
    status,
    isSubmitting,
    values,
}: FormikProps<FormValuesType>) {
    const { debtData, setDebtDetail } = status as {
        debtData: Debt
        setDebtDetail: Dispatch<SetStateAction<DebtDetail | undefined>>
    }

    const isNew = Boolean(debtData.uuid)
    const isDisabled =
        isSubmitting || Boolean(debtData?.hasDetails) || values.is_final

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="debts-form"
            isNew={isNew}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    confirmationText: values.is_final
                        ? 'Perubahan yang dilakukan bersifat final dan tidak dapat diubah lagi. Apakah Anda yakin?'
                        : undefined,
                    disabled: isSubmitting,
                },
            }}
            submitting={isSubmitting}>
            {debtData?.uuid && (
                <TextField
                    disabled
                    label="Kode"
                    name="uuid"
                    textFieldProps={{
                        margin: 'normal',
                        required: false,
                        variant: 'filled',
                    }}
                    value={shortUuid(debtData.uuid as UUID)}
                />
            )}

            <Field name="business_unit_id">
                {({
                    field: { name, value, onBlur, onChange },
                    meta: { error },
                }: FieldProps) => {
                    return (
                        <SelectFromApi
                            disabled={isDisabled}
                            endpoint="/data/business-units"
                            label="Unit Bisnis"
                            margin="dense"
                            onChange={onChange}
                            selectProps={{
                                name: name,
                                onBlur: onBlur,
                                value: value ?? '',
                            }}
                            size="small"
                            {...errorsToHelperTextObj(error)}
                        />
                    )
                }}
            </Field>

            <DateField disabled={isDisabled} label="Tanggal" name="at" />

            <NumericField
                disabled={isDisabled}
                label="Nilai Dasar Hutang"
                name="base_rp"
            />

            <Grid container>
                <Grid size={{ xs: 6 }}>
                    <NumericField
                        disabled={isDisabled}
                        label="Tenor"
                        name="term"
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Field name="term_unit">
                        {({ field }: FieldProps<string>) => (
                            <FormControl
                                fullWidth
                                margin="dense"
                                required
                                size="small">
                                <InputLabel id="term_unit-select-label">
                                    Satuan
                                </InputLabel>

                                <Select
                                    {...field}
                                    disabled={isDisabled}
                                    id="term_unit-select"
                                    label="Satuan"
                                    labelId="term_unit-select-label"
                                    required
                                    value={field.value ?? ''}>
                                    {Object.values(TermUnit).map(unit => (
                                        <MenuItem key={unit} value={unit}>
                                            {ucWords(unit)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Field>
                </Grid>
            </Grid>

            <Grid container>
                <Grid size={{ xs: 6 }}>
                    <NumericField
                        disabled={isDisabled}
                        label="Bunga"
                        name="interest"
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Field name="interest_unit">
                        {({ field }: FieldProps<string>) => (
                            <FormControl
                                fullWidth
                                margin="dense"
                                required
                                size="small">
                                <InputLabel id="interest_unit-select-label">
                                    Satuan
                                </InputLabel>

                                <Select
                                    {...field}
                                    disabled={isDisabled}
                                    id="interest_unit-select"
                                    label="Satuan"
                                    labelId="interest_unit-select-label"
                                    required
                                    value={field.value ?? ''}>
                                    {Object.values(InterestUnit).map(unit => (
                                        <MenuItem key={unit} value={unit}>
                                            {ucWords(unit)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Field>
                </Grid>
            </Grid>

            <TextField
                disabled={isSubmitting || isDisabled}
                label="Catatan / Informasi Tambahan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                    rows: 3,
                }}
            />

            <Typography
                sx={{
                    mt: 2,
                }}>
                Rincian
            </Typography>

            <DebtDetailsTable
                rows={
                    debtData.hasDetails
                        ? debtData.details
                        : generateRows(values)
                }
                setDebtDetail={setDebtDetail}
            />

            <Field name="is_final">
                {({
                    field: { name },
                    meta: { error, value },
                    form: { setFieldValue },
                }: FieldProps<boolean>) => (
                    <FormControl
                        disabled={isSubmitting || Boolean(debtData?.hasDetails)}
                        error={Boolean(error)}
                        margin="normal">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={value}
                                        onChange={() =>
                                            setFieldValue(name, !value)
                                        }
                                        size="small"
                                    />
                                }
                                label="Simpan Permanen"
                            />
                        </FormGroup>

                        <FormHelperText error={Boolean(error)}>
                            {error}
                        </FormHelperText>
                    </FormControl>
                )}
            </Field>
        </FormikForm>
    )
}

export type FormValuesType = Partial<{
    at: Debt['at']
    business_unit_id: Debt['business_unit_id']
    term: Debt['term']
    term_unit: Debt['term_unit']
    interest: Debt['interest']
    interest_unit: Debt['interest_unit']
    base_rp: Debt['base_rp']
    note: Debt['note']
}> & {
    is_final: boolean
}

export function calcTotalRp({
    base_rp,
    interest,
    interest_unit,
    term,
    term_unit,
}: {
    base_rp: number
    interest: number
    interest_unit: InterestUnit
    term: number
    term_unit: TermUnit
}) {
    if (
        !(
            base_rp &&
            typeof interest === 'number' &&
            interest_unit &&
            term &&
            term_unit
        )
    )
        return 0

    return interest_unit === InterestUnit.RP
        ? base_rp + interest
        : base_rp + (base_rp * interest) / 100
}

function generateRows({
    at,
    base_rp,
    interest,
    interest_unit,
    term,
    term_unit,
}: FormValuesType) {
    if (
        !(
            at &&
            base_rp &&
            typeof interest === 'number' &&
            interest_unit &&
            term &&
            term_unit
        )
    )
        return []

    const rows: {
        due: Debt['details'][0]['due']
        rp: Debt['details'][0]['rp']
    }[] = []

    const atDayJs = dayjs(at)

    const totalRp = calcTotalRp({
        base_rp,
        interest,
        interest_unit,
        term,
        term_unit,
    })

    const detailRp = totalRp / term

    for (let i = 1; i <= term; i++) {
        rows.push({
            due: atDayJs.clone().add(i, term_unit).format('YYYY-MM-DD') as Ymd,
            rp: detailRp,
        })
    }

    return rows
}
