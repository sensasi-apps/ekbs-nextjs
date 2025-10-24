// types

// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import { Field, type FieldProps, type FormikProps, useFormik } from 'formik'
import { memo, useEffect, useState } from 'react'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import LoadingAdornment from '@/components/LoadingAddorment'
import NumericFormat from '@/components/NumericFormat'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserAutocomplete from '@/components/user-autocomplete'
import Role from '@/enums/role'
import useAuthInfo from '@/hooks/use-auth-info'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import axios from '@/lib/axios'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// modules
import type MinimalUser from '@/modules/user/types/minimal-user'
import type { Ymd } from '@/types/date-string'
import type CashType from '@/types/orms/cash'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import getLoanStatusColor from '@/utils/get-loan-status-color'
import errorCatcher from '@/utils/handle-422'
// local components
import type { UserLoanFormDataType } from './Form/types'
import UserLoanInstallmentDialog from './InstallmentDialog'

export default function LoanForm({
    errors,
    dirty,
    values: loanValues,
    values,
    isSubmitting,
    handleReset,
    setFieldValue,
    status,
}: FormikProps<UserLoanFormDataType>) {
    if (!status.mode || status.userLoanFromDb === undefined) {
        throw new Error('status.mode or status.userLoanFromDb is undefined')
    }

    const currentUser = useAuthInfo()

    const isAuthHasPermission = useIsAuthHasPermission()
    const isAuthHasRole = useIsAuthHasRole()

    const mode: 'applier' | 'manager' = status.mode
    const userLoanFromDb: UserLoanORM | null = status.userLoanFromDb

    const [userAutocompleteValue, setUserAutocompleteValue] =
        useState<MinimalUser | null>(userLoanFromDb?.user ?? null)

    const isApplierMode = mode === 'applier'
    const isManager = isAuthHasRole(Role.USER_LOAN_MANAGER) && !isApplierMode

    const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
        initialValues: {},
        onSubmit: (_, { setErrors }) =>
            (isManager
                ? axios.delete(`/user-loans/${userLoanFromDb?.uuid}`)
                : axios.delete(`/loans/${userLoanFromDb?.uuid}`)
            )
                .then(() => handleReset())
                .catch(error => errorCatcher(error, setErrors)),
    })

    const agreementText =
        'Dengan mengirimkan ajuan ' +
        loanValues.type +
        ' ini saya telah ' +
        (isManager ? 'memastikan' : 'menyetujui') +
        ' besar nilai angsuran per ' +
        loanValues.term_unit +
        ', simulasi angsuran, dan sanksi keterlambatan yang ditetapkan oleh koperasi' +
        (isManager ? ' telah sesuai dengan permintaan pemohon' : '') +
        '. Jika terdapat kesalahan dalam pengisian data maka saya bersedia untuk bertanggung jawab.'

    const isNew = !userLoanFromDb?.uuid
    const isCreatedByCurrentUser = isNew
        ? true
        : userLoanFromDb?.activity_logs.length &&
          userLoanFromDb.activity_logs[0].user_uuid === currentUser?.uuid

    const {
        data: userDefaultTermUnit = loanValues.term_unit ?? 'bulan',
        isLoading: isTermUnitLoading,
    } = useSWR<string>(
        loanValues.user_uuid && isNew
            ? `users/${loanValues.user_uuid}/preferences/transaction_term_unit`
            : null,
    )

    useEffect(() => {
        setFieldValue('term_unit', userDefaultTermUnit)
    }, [userDefaultTermUnit, setFieldValue])

    const hasResponses = isNew
        ? false
        : (userLoanFromDb.responses?.length ?? 0) > 0
    const isProcessing = isSubmitting || isDeleting
    const isDisabled = Boolean(
        isProcessing ||
            hasResponses ||
            isTermUnitLoading ||
            !isCreatedByCurrentUser ||
            userLoanFromDb?.transaction,
    )

    const isUserCanDelete =
        !isNew &&
        isAuthHasPermission('delete own loan') &&
        isCreatedByCurrentUser &&
        !hasResponses

    const disabledCashUuid = Boolean(
        !isManager ||
            userLoanFromDb?.transaction ||
            isProcessing ||
            isTermUnitLoading,
    )

    return (
        <FormikForm
            dirty={dirty}
            id="user-loan-form"
            isNew={isNew}
            processing={isProcessing}
            slotProps={{
                deleteButton: {
                    disabled: isDisabled || !isUserCanDelete,
                    loading: isDeleting,
                    onClick: () => handleDelete(),
                },
                submitButton: {
                    disabled: false,
                },
            }}
            submitting={isSubmitting}>
            <UserLoanInfoGrid data={userLoanFromDb} />

            <Field name="type">
                {({ field: { value, onChange, name } }: FieldProps) => (
                    <FormControl
                        disabled={isDisabled}
                        error={Boolean(errors.type)}
                        fullWidth
                        margin="dense"
                        required>
                        <FormLabel required>Jenis</FormLabel>
                        <RadioGroup
                            name={name}
                            onChange={onChange}
                            row
                            value={(value as string).toLocaleLowerCase()}>
                            <FormControlLabel
                                control={<Radio />}
                                label="Dana Tunai"
                                required
                                value="dana tunai"
                            />
                            <FormControlLabel
                                control={<Radio />}
                                label="Kredit Barang"
                                value="kredit barang"
                            />
                        </RadioGroup>
                        {Boolean(errors.type) && (
                            <FormHelperText>{errors.type}</FormHelperText>
                        )}
                    </FormControl>
                )}
            </Field>

            {isManager && (
                <UserAutocomplete
                    disabled={isDisabled}
                    fullWidth
                    label="Pemohon"
                    onChange={(_, user) => {
                        setUserAutocompleteValue(user)
                        setFieldValue('user_uuid', user?.uuid)
                    }}
                    slotProps={{
                        textField: {
                            margin: 'dense',
                            required: true,
                            ...errorsToHelperTextObj(errors.user_uuid),
                        },
                    }}
                    value={userAutocompleteValue}
                />
            )}

            <NumericFormat
                decimalScale={0}
                disabled={isDisabled}
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                }}
                label="Jumlah"
                name="proposed_rp"
                onValueChange={({ floatValue }) =>
                    debounce(() => setFieldValue('proposed_rp', floatValue))
                }
                value={values.proposed_rp}
                {...errorsToHelperTextObj(errors.proposed_rp)}
            />

            <Box display="flex" gap={1}>
                <NumericFormat
                    decimalScale={0}
                    disabled={isDisabled}
                    inputProps={{
                        maxLength: 2,
                        minLength: 1,
                    }}
                    label="Jangka Waktu"
                    name="n_term"
                    onValueChange={({ floatValue }) =>
                        debounce(() => setFieldValue('n_term', floatValue))
                    }
                    value={values.n_term}
                    {...errorsToHelperTextObj(errors.n_term)}
                />

                <FormControl
                    disabled={isDisabled || mode === 'applier'}
                    error={Boolean(errors.term_unit)}
                    fullWidth
                    margin="dense"
                    required>
                    <InputLabel size="small">Satuan Waktu Angsuran</InputLabel>
                    <Select
                        endAdornment={
                            <LoadingAdornment show={isTermUnitLoading} />
                        }
                        label="Satuan Waktu Angsuran"
                        name="term_unit"
                        onChange={e =>
                            setFieldValue('term_unit', e.target.value)
                        }
                        required
                        size="small"
                        value={values.term_unit}>
                        <MenuItem value="minggu">Minggu</MenuItem>
                        <MenuItem value="bulan">Bulan</MenuItem>
                    </Select>
                    {errors.term_unit && (
                        <FormHelperText>{errors.term_unit}</FormHelperText>
                    )}
                </FormControl>
            </Box>

            <Field
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Keperluan"
                multiline
                name="purpose"
                rows={2}
            />

            <Box display="flex" gap={1}>
                <DatePicker
                    disabled={isDisabled || isApplierMode}
                    label="Tanggal"
                    onChange={value =>
                        debounce(() =>
                            setFieldValue(
                                'proposed_at',
                                value?.format('YYYY-MM-DD') ?? null,
                            ),
                        )
                    }
                    slotProps={{
                        textField: {
                            name: 'proposed_at',
                            ...errorsToHelperTextObj(errors.proposed_at),
                        },
                    }}
                    value={
                        values.proposed_at ? dayjs(values.proposed_at) : null
                    }
                />

                <NumericFormat
                    decimalScale={1}
                    disabled={isDisabled || !isAuthHasRole(Role.EMPLOYEE)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                        ),
                    }}
                    inputProps={{
                        maxLength: 4,
                        minLength: 1,
                    }}
                    label={'Persentase Jasa per ' + values.term_unit}
                    name={'interest_percent'}
                    onValueChange={({ floatValue }) =>
                        debounce(() =>
                            setFieldValue('interest_percent', floatValue),
                        )
                    }
                    value={values.interest_percent}
                    {...errorsToHelperTextObj(errors.interest_percent)}
                />
            </Box>

            <Box my={0.5} textAlign="end">
                <UserLoanInstallmentDialog
                    data={{ ...userLoanFromDb, ...loanValues }}
                    isProcessing={isProcessing}
                />
            </Box>

            <Box mb={1}>
                <SelectFromApi
                    disabled={disabledCashUuid}
                    endpoint="/data/cashes"
                    label="Telah dicairkan melalui Kas"
                    margin="none"
                    onValueChange={(cash: CashType) => {
                        setFieldValue('cashable_uuid', cash.uuid)
                    }}
                    renderOption={(cash: CashType) => (
                        <MenuItem key={cash.uuid} value={cash.uuid}>
                            {cash.code && (
                                <Chip
                                    label={cash.code}
                                    size="small"
                                    sx={{
                                        mr: 1,
                                    }}
                                    variant="outlined"
                                />
                            )}

                            {cash.name}
                        </MenuItem>
                    )}
                    required
                    selectProps={{
                        value: loanValues.cashable_uuid ?? '',
                    }}
                    size="small"
                    {...errorsToHelperTextObj(errors.cashable_uuid)}
                />
            </Box>

            <Typography variant="caption">{agreementText}</Typography>
        </FormikForm>
    )
}

export const INITIAL_VALUES: UserLoanFormDataType = {
    cashable_uuid: '',
    interest_percent: 1.5,
    n_term: '',
    proposed_at: dayjs().format('YYYY-MM-DD') as Ymd,
    proposed_rp: '',
    purpose: '',
    term_unit: 'bulan',
    type: 'dana tunai',
    user_uuid: '',
}

const UserLoanInfoGrid = memo(function UserLoanInfoGrid({
    data: userLoan,
}: {
    data: UserLoanORM | null
}) {
    const isNew = !userLoan?.uuid

    if (isNew) return null

    const hasResponses = (userLoan?.responses?.length ?? 0) > 0

    return (
        <Grid container mb={2}>
            {hasResponses && (
                <Grid item xs={6}>
                    <Typography variant="caption">
                        Telah ditinjau oleh:
                    </Typography>

                    <ul
                        style={{
                            margin: 0,
                        }}>
                        {userLoan?.responses?.map((response, i) => (
                            <Typography component="li" key={i}>
                                {'by_user' in response && response.by_user
                                    ? response.by_user.name
                                    : ''}
                            </Typography>
                        ))}
                    </ul>
                </Grid>
            )}

            <Grid item xs={6}>
                <Typography variant="caption">Status:</Typography>
                <Typography
                    color={getLoanStatusColor(userLoan.status, '.main')}
                    fontWeight="bold"
                    textTransform="capitalize">
                    {userLoan.status}
                </Typography>
            </Grid>
        </Grid>
    )
})
