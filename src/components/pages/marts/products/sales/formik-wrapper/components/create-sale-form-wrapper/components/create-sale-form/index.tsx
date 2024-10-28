// types
import type { FormikStatusType, FormValuesType } from '../../../..'
// vendors
import { Field, FieldProps, useFormikContext } from 'formik'
import { memo, useEffect } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import dayjs from 'dayjs'
import Grid2 from '@mui/material/Unstable_Grid2'
import useSWR from 'swr'
// subcomponents
import { NumericField } from '@/components/FormikForm'
import BuyerUserUuidFieldComponent from './components/buyer-user-uuid-field-component'
import CashableUuidFieldComponent from './components/cashable-uuid-field-component'
import CostsFieldComponent from './components/costs-field-component'
import DefaultItemDesc from '../../../../../@shared-subcomponents/default-item-desc'
import DetailsFieldComponent from './components/details-field-component'
// utils
import { toYmd } from '@/functions/toYmd'
import ApiUrl from '../../../../../@enums/api-url'
import formatNumber from '@/utils/formatNumber'
import useAuth from '@/providers/Auth'

function CreateSaleForm() {
    const { user } = useAuth()
    const { setFieldValue, status, isSubmitting } =
        useFormikContext<FormValuesType>()
    const { data: newNumber } = useSWR<number>(ApiUrl.NEW_SALE_NUMBER, {
        keepPreviousData: true,
    })

    useEffect(() => {
        if (!newNumber) return

        setFieldValue('no', newNumber)
    }, [newNumber, setFieldValue])

    const typedStatus = status as FormikStatusType

    return (
        <>
            <DefaultItemDesc
                desc="TGL"
                value={typedStatus?.submittedData?.at ?? toYmd(dayjs())}
            />

            <DefaultItemDesc
                desc="NO. Nota"
                value={
                    typedStatus?.submittedData?.no.toString() ??
                    newNumber?.toString() ??
                    ''
                }
            />

            <DefaultItemDesc desc="Kasir" value={user?.name ?? ''} />

            <Box display="flex" alignItems="center">
                <DefaultItemDesc desc="Pelanggan" value="" />

                <Field
                    name="buyer_user"
                    component={BuyerUserUuidFieldComponent}
                />
            </Box>

            <DefaultItemDesc desc="Pembayaran Ke" value="" />

            <Field
                name="cashable_uuid"
                component={CashableUuidFieldComponent}
            />

            <Box mt={4} display="flex" flexDirection="column" gap={1.5}>
                <Field name="details" component={DetailsFieldComponent} />
            </Box>

            <Divider
                sx={{
                    my: 1,
                }}
            />

            <Box>
                <Field name="costs" component={CostsFieldComponent} />
            </Box>

            <Divider
                sx={{
                    my: 0.5,
                }}
            />

            <Grid2 container alignItems="center">
                <Grid2
                    xs={7}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    pl={1}>
                    Total
                </Grid2>

                <Grid2
                    xs={1}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    Rp
                </Grid2>

                <Grid2
                    xs={4}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    <Field
                        component={({ form: { values } }: FieldProps) => {
                            const formValues = values as FormValuesType

                            const totalDetails = formValues.details.reduce(
                                (acc, { qty, rp_per_unit }) =>
                                    acc + Math.abs(qty) * rp_per_unit,
                                0,
                            )

                            const totalCosts = formValues.costs.reduce(
                                (acc, { rp }) => acc + (rp ?? 0),
                                0,
                            )

                            const grandTotalSale = totalDetails + totalCosts

                            return formatNumber(grandTotalSale)
                        }}
                    />
                </Grid2>

                <Grid2
                    xs={7}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    pl={1}>
                    BAYAR
                </Grid2>

                <Grid2
                    xs={1}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    Rp
                </Grid2>

                <Grid2
                    xs={4}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    paddingLeft={2}>
                    <NumericField
                        name="total_payment"
                        disabled={typedStatus.isDisabled || isSubmitting}
                        numericFormatProps={{
                            InputProps: {
                                autoComplete: 'off',
                            },
                            inputProps: {
                                sx: {
                                    py: 0.5,
                                    px: 0.75,
                                    textAlign: 'right',
                                    autocomplete: 'off',
                                },
                            },
                        }}
                    />
                </Grid2>

                <Grid2
                    xs={7}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    pl={1}>
                    Kembalian
                </Grid2>

                <Grid2
                    xs={1}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    Rp
                </Grid2>

                <Grid2
                    xs={4}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    paddingLeft={2}>
                    <Field
                        component={({ form: { values } }: FieldProps) => {
                            const formValues = values as FormValuesType

                            if (!values?.total_payment) return 0

                            const totalDetails = formValues.details.reduce(
                                (acc, { qty, rp_per_unit }) =>
                                    acc + Math.abs(qty) * rp_per_unit,
                                0,
                            )

                            const totalCosts = formValues.costs.reduce(
                                (acc, { rp }) => acc + (rp ?? 0),
                                0,
                            )

                            return formatNumber(
                                values.total_payment -
                                    totalDetails +
                                    totalCosts,
                            )
                        }}
                    />
                </Grid2>
            </Grid2>
        </>
    )
}

export default memo(CreateSaleForm)
