// types
import type { UUID } from 'crypto'
import type RentItemRent from '@/types/orms/rent-item-rent'
import type UserType from '@/modules/auth/types/orms/user'
// vendors
import { FastField, useFormik, type FormikProps } from 'formik'
import { memo } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import ImageButtonAndModal from '@/components/ImageButtonAndModal'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import PrintHandler from '@/components/PrintHandler'
import UserActivityLogs from '@/components/UserActivityLogs'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
// enums
import HeavyEquipmentRent from '@/enums/permissions/heavy-equipment-rent'
import handle422 from '@/utils/handle-422'
// parts
import ApiUrlEnum from '../api-url-enum'
import PrintPage from './print-page'
import HerPaymentFields from './payment-fields'
import HerTaskDetail from '../her-task-detail'
import BaseTaskFields from './base-task-fields'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

const HeavyEquipmentRentForm = memo(function HeavyEquipmentRentForm({
    dirty,
    errors,
    isSubmitting,
    values,
    setFieldValue,
    handleReset,
    setErrors,
    mutate,
}: FormikProps<HeavyEquipmentRentFormValues> & {
    mutate: () => void
}) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const {
        uuid,
        short_uuid,
        is_paid,
        heavy_equipment_rent,
        finished_at,
        validated_by_admin_at,
        validated_by_admin_user,
        user_activity_logs,
        rate_unit,
        type,
        is_validated_by_admin,
    } = values

    const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
        initialValues: {},
        onSubmit: () =>
            isRentCanBeDeleted
                ? axios
                      .delete(ApiUrlEnum.DELETE.replace('$1', uuid ?? ''))
                      .then(() => {
                          mutate()
                          handleReset()
                      })
                      .catch(error => handle422(error, setErrors))
                : undefined,
    })

    const totalRp = calculateTotalRp(values)

    const isHerTaskFinished = Boolean(finished_at)

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled =
        is_paid ||
        isPropcessing ||
        !isAuthHasPermission([
            HeavyEquipmentRent.CREATE,
            HeavyEquipmentRent.UPDATE,
        ]) ||
        isDeleting

    const isRentCanBeDeleted =
        isAuthHasPermission(HeavyEquipmentRent.DELETE) &&
        !isHerTaskFinished &&
        !isNew

    return (
        <FormikForm
            id="heavy-equipment-rent-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                deleteButton: isRentCanBeDeleted
                    ? {
                          onClick: () => handleDelete(),
                          loading: isDeleting,
                          disabled: isDisabled,
                      }
                    : undefined,
            }}>
            {short_uuid && (
                <>
                    <UserActivityLogs data={user_activity_logs ?? []} />

                    <Box display="flex" gap={1} alignItems="center">
                        <TextField
                            label="Kode"
                            value={short_uuid}
                            variant="filled"
                            disabled
                            {...errorsToHelperTextObj(errors.uuid)}
                        />

                        <PrintHandler>
                            <PrintPage data={values} />
                        </PrintHandler>
                    </Box>
                </>
            )}

            {isHerTaskFinished ? (
                <>
                    <Box my={2}>
                        <HerTaskDetail data={values as RentItemRent} />
                    </Box>

                    <FastField
                        name="note"
                        required={false}
                        component={TextFieldFastableComponent}
                        multiline
                        disabled={isDisabled}
                        rows={2}
                        label="Catatan Tambahan"
                        {...errorsToHelperTextObj(errors.note)}
                    />
                </>
            ) : (
                <BaseTaskFields
                    values={values}
                    isDisabled={isDisabled}
                    setFieldValue={setFieldValue}
                    errors={errors}
                />
            )}

            {isHerTaskFinished && (
                <>
                    {type !== 'public-service' && (
                        <HerPaymentFields
                            isDisabled={isDisabled}
                            totalRp={totalRp}
                            values={values}
                            errors={errors}
                            setFieldValue={setFieldValue}
                        />
                    )}

                    <DatePicker
                        value={dayjs(finished_at)}
                        disabled={true}
                        label="Dikerjakan operator pada"
                        sx={{ mt: 3 }}
                    />

                    {rate_unit === 'H.M' && (
                        <Box display="inline-flex" gap={1}>
                            <NumericFormat
                                label="H.M Awal"
                                disabled={true}
                                value={heavy_equipment_rent?.start_hm ?? ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <NumericFormat
                                label="H.M Akhir"
                                disabled={true}
                                value={heavy_equipment_rent?.end_hm}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    )}

                    <div
                        style={{
                            marginTop: '1rem',
                        }}>
                        <Typography
                            component="div"
                            color="gray"
                            fontWeight="bold">
                            TOTAL KESELURUHAN
                        </Typography>
                        <Typography component="div">
                            {numberToCurrency(totalRp)}
                        </Typography>
                    </div>

                    {heavy_equipment_rent?.file && (
                        <Box mt={2}>
                            <Typography variant="caption">
                                Foto H.M Akhir:
                            </Typography>
                            <ImageButtonAndModal
                                file={heavy_equipment_rent.file}
                                alt="Foto H.M Akhir"
                            />
                        </Box>
                    )}

                    <FormControl
                        disabled={isDisabled}
                        style={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                        }}>
                        <FormControlLabel
                            label="Sudah divalidasi dan diverifikasi"
                            control={
                                <Checkbox
                                    checked={is_validated_by_admin}
                                    onChange={({ currentTarget }) =>
                                        setFieldValue(
                                            'is_validated_by_admin',
                                            currentTarget.checked,
                                        )
                                    }
                                    name="is_validated_by_admin"
                                />
                            }
                        />

                        {Boolean(validated_by_admin_at) && (
                            <FormHelperText>
                                Oleh {validated_by_admin_user?.name} pada:{' '}
                                {validated_by_admin_at}
                            </FormHelperText>
                        )}
                    </FormControl>
                </>
            )}
        </FormikForm>
    )
})

export default HeavyEquipmentRentForm

export type HeavyEquipmentRentFormValues = Partial<
    RentItemRent & {
        farmer_group_uuid: UUID
        interest_percent: number
        n_term: number
        term_unit: 'minggu' | 'bulan'

        cashable_uuid: UUID

        operated_by_user: UserType
        operated_by_user_uuid: UUID
        is_validated_by_admin: boolean
    }
>

function calculateTotalRp({
    heavy_equipment_rent,
    for_n_units,
    rate_rp_per_unit,
    payment_method,
    interest_percent,
    n_term,
}: HeavyEquipmentRentFormValues) {
    const { start_hm = 0, end_hm = 0 } = heavy_equipment_rent ?? {}

    const diffHm = end_hm - start_hm

    const baseRp: number =
        (diffHm ?? for_n_units ?? 0) * (rate_rp_per_unit ?? 0)

    const ifInstallmentRp =
        payment_method === 'installment'
            ? Math.ceil(
                  baseRp * ((interest_percent ?? 0) / 100) * (n_term ?? 0),
              )
            : 0

    return baseRp + ifInstallmentRp
}
