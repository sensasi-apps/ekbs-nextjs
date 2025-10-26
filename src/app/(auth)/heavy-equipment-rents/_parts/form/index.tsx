// types

// materials
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
// vendors
import { FastField, type FormikProps, useFormik } from 'formik'
import { memo } from 'react'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import ImageButtonAndModal from '@/components/ImageButtonAndModal'
import NumericFormat from '@/components/NumericFormat'
import PrintHandler from '@/components/print-handler'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserActivityLogs from '@/components/UserActivityLogs'
// enums
import HeavyEquipmentRent from '@/enums/permissions/heavy-equipment-rent'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type UserType from '@/modules/user/types/orms/user'
import type RentItemRent from '@/types/orms/rent-item-rent'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
// parts
import ApiUrlEnum from '../api-url-enum'
import HerTaskDetail from '../her-task-detail'
import BaseTaskFields from './base-task-fields'
import HerPaymentFields from './payment-fields'
import PrintPage from './print-page'

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
            autoComplete="off"
            dirty={dirty}
            id="heavy-equipment-rent-form"
            isNew={isNew}
            processing={isPropcessing}
            slotProps={{
                deleteButton: isRentCanBeDeleted
                    ? {
                          disabled: isDisabled,
                          loading: isDeleting,
                          onClick: () => handleDelete(),
                      }
                    : undefined,
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            {short_uuid && (
                <>
                    <UserActivityLogs data={user_activity_logs ?? []} />

                    <Box alignItems="center" display="flex" gap={1}>
                        <TextField
                            disabled
                            label="Kode"
                            value={short_uuid}
                            variant="filled"
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
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Catatan Tambahan"
                        multiline
                        name="note"
                        required={false}
                        rows={2}
                        {...errorsToHelperTextObj(errors.note)}
                    />
                </>
            ) : (
                <BaseTaskFields
                    errors={errors}
                    isDisabled={isDisabled}
                    setFieldValue={setFieldValue}
                    values={values}
                />
            )}

            {isHerTaskFinished && (
                <>
                    {type !== 'public-service' && (
                        <HerPaymentFields
                            errors={errors}
                            isDisabled={isDisabled}
                            setFieldValue={setFieldValue}
                            totalRp={totalRp}
                            values={values}
                        />
                    )}

                    <DatePicker
                        disabled={true}
                        label="Dikerjakan operator pada"
                        sx={{ mt: 3 }}
                        value={dayjs(finished_at)}
                    />

                    {rate_unit === 'H.M' && (
                        <Box display="inline-flex" gap={1}>
                            <NumericFormat
                                disabled={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                                label="H.M Awal"
                                value={heavy_equipment_rent?.start_hm ?? ''}
                            />

                            <NumericFormat
                                disabled={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                                label="H.M Akhir"
                                value={heavy_equipment_rent?.end_hm}
                            />
                        </Box>
                    )}

                    <div
                        style={{
                            marginTop: '1rem',
                        }}>
                        <Typography
                            color="gray"
                            component="div"
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
                                alt="Foto H.M Akhir"
                                file={heavy_equipment_rent.file}
                            />
                        </Box>
                    )}

                    <FormControl
                        disabled={isDisabled}
                        style={{
                            marginBottom: '1rem',
                            marginTop: '1rem',
                        }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={is_validated_by_admin}
                                    name="is_validated_by_admin"
                                    onChange={({ currentTarget }) =>
                                        setFieldValue(
                                            'is_validated_by_admin',
                                            currentTarget.checked,
                                        )
                                    }
                                />
                            }
                            label="Sudah divalidasi dan diverifikasi"
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
