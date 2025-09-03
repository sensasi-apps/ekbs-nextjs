// types
import type { Dispatch, SetStateAction } from 'react'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type Debt from '@/types/orms/debt'
import type DebtDetail from '@/types/orms/debt-detail'
// vendors
import { Field, type FieldProps, type FormikProps } from 'formik'
import dayjs from 'dayjs'
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
// components
import DebtDetailsTable from './Form/DebtDetailsTable'
// formik
import FormikForm from '@/components/formik-form'
import DateField from '@/components/formik-fields/date-field'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import shortUuid from '@/utils/short-uuid'
import ucWords from '@/utils/uc-words'
// enums
import TermUnit from '@/dataTypes/enums/DbColumns/Debts/TermUnit'
import InterestUnit from '@/dataTypes/enums/DbColumns/Debts/InterestUnit'
import SelectFromApi from '@/components/Global/SelectFromApi'

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
            id="debts-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting,
                    confirmationText: values.is_final
                        ? 'Perubahan yang dilakukan bersifat final dan tidak dapat diubah lagi. Apakah Anda yakin?'
                        : undefined,
                },
            }}>
            {debtData?.uuid && (
                <TextField
                    name="uuid"
                    label="Kode"
                    disabled
                    value={shortUuid(debtData.uuid as UUID)}
                    textFieldProps={{
                        margin: 'normal',
                        variant: 'filled',
                        required: false,
                    }}
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
                            size="small"
                            margin="dense"
                            selectProps={{
                                value: value ?? '',
                                name: name,
                                onBlur: onBlur,
                            }}
                            onChange={onChange}
                            {...errorsToHelperTextObj(error)}
                        />
                    )
                }}
            </Field>

            <DateField name="at" label="Tanggal" disabled={isDisabled} />

            <NumericField
                name="base_rp"
                label="Nilai Dasar Hutang"
                disabled={isDisabled}
            />

            <Grid container>
                <Grid size={{ xs: 6 }}>
                    <NumericField
                        name="term"
                        label="Tenor"
                        disabled={isDisabled}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Field name="term_unit">
                        {({ field }: FieldProps<string>) => (
                            <FormControl
                                fullWidth
                                margin="dense"
                                size="small"
                                required>
                                <InputLabel id="term_unit-select-label">
                                    Satuan
                                </InputLabel>

                                <Select
                                    {...field}
                                    value={field.value ?? ''}
                                    required
                                    label="Satuan"
                                    disabled={isDisabled}
                                    labelId="term_unit-select-label"
                                    id="term_unit-select">
                                    {Object.values(TermUnit).map(unit => (
                                        <MenuItem value={unit} key={unit}>
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
                        name="interest"
                        label="Bunga"
                        disabled={isDisabled}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Field name="interest_unit">
                        {({ field }: FieldProps<string>) => (
                            <FormControl
                                fullWidth
                                margin="dense"
                                size="small"
                                required>
                                <InputLabel id="interest_unit-select-label">
                                    Satuan
                                </InputLabel>

                                <Select
                                    {...field}
                                    value={field.value ?? ''}
                                    required
                                    label="Satuan"
                                    disabled={isDisabled}
                                    labelId="interest_unit-select-label"
                                    id="interest_unit-select">
                                    {Object.values(InterestUnit).map(unit => (
                                        <MenuItem value={unit} key={unit}>
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
                name="note"
                label="Catatan / Informasi Tambahan"
                disabled={isSubmitting || isDisabled}
                textFieldProps={{
                    required: false,
                    multiline: true,
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
                        margin="normal"
                        error={Boolean(error)}
                        disabled={
                            isSubmitting || Boolean(debtData?.hasDetails)
                        }>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={value}
                                        onChange={() =>
                                            setFieldValue(name, !value)
                                        }
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
