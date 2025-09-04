// types
import type { Ymd } from '@/types/date-string'
import type CashType from '@/types/orms/cash'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// vendors
import { Field, useFormik, type FormikProps, type FieldProps } from 'formik'
import { useEffect, useState, memo } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
import useSWR from 'swr'
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
// components
import DatePicker from '@/components/DatePicker'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import NumericFormat from '@/components/NumericFormat'
import FormikForm from '@/components/formik-form'
import LoadingAddorment from '@/components/LoadingAddorment'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserAutocomplete from '@/components/UserAutocomplete'
// utils
import getLoanStatusColor from '@/utils/get-loan-status-color'
import errorCatcher from '@/utils/handle-422'
// local components
import type { UserLoanFormDataType } from './Form/types'
import UserLoanInstallmentDialog from './InstallmentDialog'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import Role from '@/enums/role'
import useAuthInfo from '@/hooks/use-auth-info'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'

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

    const [userAutocompleteValue, setUserAutocompleteValue] = useState(
        userLoanFromDb?.user ?? null,
    )

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
            id="user-loan-form"
            isNew={isNew}
            dirty={dirty}
            submitting={isSubmitting}
            processing={isProcessing}
            slotProps={{
                deleteButton: {
                    onClick: () => handleDelete(),
                    loading: isDeleting,
                    disabled: isDisabled || !isUserCanDelete,
                },
                submitButton: {
                    disabled: false,
                },
            }}>
            <UserLoanInfoGrid data={userLoanFromDb} />

            <Field name="type">
                {({ field: { value, onChange, name } }: FieldProps) => (
                    <FormControl
                        error={Boolean(errors.type)}
                        disabled={isDisabled}
                        fullWidth
                        required
                        margin="dense">
                        <FormLabel required>Jenis</FormLabel>
                        <RadioGroup
                            row
                            value={(value as string).toLocaleLowerCase()}
                            name={name}
                            onChange={onChange}>
                            <FormControlLabel
                                value="dana tunai"
                                required
                                control={<Radio />}
                                label="Dana Tunai"
                            />
                            <FormControlLabel
                                value="kredit barang"
                                control={<Radio />}
                                label="Kredit Barang"
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
                    label="Pemohon"
                    disabled={isDisabled}
                    fullWidth
                    onChange={(_, user) => {
                        setUserAutocompleteValue(user)
                        setFieldValue('user_uuid', user?.uuid)
                    }}
                    value={userAutocompleteValue}
                    size="small"
                    textFieldProps={{
                        required: true,
                        margin: 'dense',
                        ...errorsToHelperTextObj(errors.user_uuid),
                    }}
                />
            )}

            <NumericFormat
                label="Jumlah"
                disabled={isDisabled}
                decimalScale={0}
                value={values.proposed_rp}
                name="proposed_rp"
                onValueChange={({ floatValue }) =>
                    debounce(() => setFieldValue('proposed_rp', floatValue))
                }
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                }}
                {...errorsToHelperTextObj(errors.proposed_rp)}
            />

            <Box display="flex" gap={1}>
                <NumericFormat
                    label="Jangka Waktu"
                    disabled={isDisabled}
                    decimalScale={0}
                    value={values.n_term}
                    name="n_term"
                    onValueChange={({ floatValue }) =>
                        debounce(() => setFieldValue('n_term', floatValue))
                    }
                    inputProps={{
                        minLength: 1,
                        maxLength: 2,
                    }}
                    {...errorsToHelperTextObj(errors.n_term)}
                />

                <FormControl
                    required
                    margin="dense"
                    disabled={isDisabled || mode === 'applier'}
                    fullWidth
                    error={Boolean(errors.term_unit)}>
                    <InputLabel size="small">Satuan Waktu Angsuran</InputLabel>
                    <Select
                        label="Satuan Waktu Angsuran"
                        size="small"
                        required
                        name="term_unit"
                        value={values.term_unit}
                        onChange={e =>
                            setFieldValue('term_unit', e.target.value)
                        }
                        endAdornment={
                            <LoadingAddorment show={isTermUnitLoading} />
                        }>
                        <MenuItem value="minggu">Minggu</MenuItem>
                        <MenuItem value="bulan">Bulan</MenuItem>
                    </Select>
                    {errors.term_unit && (
                        <FormHelperText>{errors.term_unit}</FormHelperText>
                    )}
                </FormControl>
            </Box>

            <Field
                name="purpose"
                label="Keperluan"
                component={TextFieldFastableComponent}
                multiline
                disabled={isDisabled}
                rows={2}
            />

            <Box display="flex" gap={1}>
                <DatePicker
                    slotProps={{
                        textField: {
                            name: 'proposed_at',
                            ...errorsToHelperTextObj(errors.proposed_at),
                        },
                    }}
                    label="Tanggal"
                    disabled={isDisabled || isApplierMode}
                    onChange={value =>
                        debounce(() =>
                            setFieldValue(
                                'proposed_at',
                                value?.format('YYYY-MM-DD') ?? null,
                            ),
                        )
                    }
                    value={
                        values.proposed_at ? dayjs(values.proposed_at) : null
                    }
                />

                <NumericFormat
                    label={'Persentase Jasa per ' + values.term_unit}
                    disabled={isDisabled || !isAuthHasRole(Role.EMPLOYEE)}
                    decimalScale={1}
                    value={values.interest_percent}
                    name={'interest_percent'}
                    onValueChange={({ floatValue }) =>
                        debounce(() =>
                            setFieldValue('interest_percent', floatValue),
                        )
                    }
                    inputProps={{
                        minLength: 1,
                        maxLength: 4,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                        ),
                    }}
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
                    required
                    endpoint="/data/cashes"
                    label="Telah dicairkan melalui Kas"
                    size="small"
                    margin="none"
                    disabled={disabledCashUuid}
                    selectProps={{
                        value: loanValues.cashable_uuid ?? '',
                    }}
                    onValueChange={(cash: CashType) => {
                        setFieldValue('cashable_uuid', cash.uuid)
                    }}
                    renderOption={(cash: CashType) => (
                        <MenuItem key={cash.uuid} value={cash.uuid}>
                            {cash.code && (
                                <Chip
                                    label={cash.code}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        mr: 1,
                                    }}
                                />
                            )}

                            {cash.name}
                        </MenuItem>
                    )}
                    {...errorsToHelperTextObj(errors.cashable_uuid)}
                />
            </Box>

            <Typography variant="caption">{agreementText}</Typography>
        </FormikForm>
    )
}

export const INITIAL_VALUES: UserLoanFormDataType = {
    user_uuid: '',
    type: 'dana tunai',
    proposed_rp: '',
    proposed_at: dayjs().format('YYYY-MM-DD') as Ymd,
    purpose: '',
    n_term: '',
    term_unit: 'bulan',
    interest_percent: 1.5,
    cashable_uuid: '',
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
                            <Typography key={i} component="li">
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
                    fontWeight="bold"
                    textTransform="capitalize"
                    color={getLoanStatusColor(userLoan.status, '.main')}>
                    {userLoan.status}
                </Typography>
            </Grid>
        </Grid>
    )
})
