// types

// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// vendors
import { Field, type FieldProps, useFormikContext } from 'formik'
import { memo } from 'react'
import DefaultItemDesc from '@/app/mart-product-sales/_parts/shared-subcomponents/default-item-desc'
// sub-components
import NumericField from '@/components/formik-fields/numeric-field'
// hooks
import useAuthInfo from '@/hooks/use-auth-info'
// utils
import formatNumber from '@/utils/format-number'
import type { FormikStatusType, FormValuesType } from '../../../..'
import BuyerUserUuidFieldComponent from './components/buyer-user-uuid-field-component'
import CashableUuidFieldComponent from './components/cashable-uuid-field-component'
import CostsFieldComponent from './components/costs-field-component'
import DetailsFieldComponent from './components/details-field-component'

function CreateSaleForm() {
    const user = useAuthInfo()
    const { status, isSubmitting } = useFormikContext<FormValuesType>()

    const typedStatus = status as FormikStatusType

    return (
        <>
            <DefaultItemDesc
                desc="Pada"
                value={typedStatus?.submittedData?.at ?? '-'}
            />

            <DefaultItemDesc desc="Kasir" value={user?.name ?? ''} />

            <Box alignItems="center" display="flex">
                <DefaultItemDesc desc="Pelanggan" value="" />

                <Field
                    component={BuyerUserUuidFieldComponent}
                    name="buyer_user"
                />
            </Box>

            <DefaultItemDesc desc="Pembayaran Ke" value="" />

            <Field
                component={CashableUuidFieldComponent}
                name="cashable_uuid"
            />

            <Box display="flex" flexDirection="column" gap={1.5} mt={4}>
                <Field component={DetailsFieldComponent} name="details" />
            </Box>

            <Divider
                sx={{
                    my: 1,
                }}
            />

            <Box>
                <Field component={CostsFieldComponent} name="costs" />
            </Box>

            <Divider
                sx={{
                    my: 0.5,
                }}
            />

            <Grid alignItems="center" container>
                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    pl={1}
                    size={{
                        xs: 7,
                    }}
                    textOverflow="ellipsis"
                    variant="overline"
                    whiteSpace="nowrap">
                    Total
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    size={{ xs: 4 }}
                    textAlign="end"
                    variant="overline">
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
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    pl={1}
                    size={{
                        xs: 7,
                    }}
                    textOverflow="ellipsis"
                    variant="overline"
                    whiteSpace="nowrap">
                    BAYAR
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    paddingLeft={2}
                    size={{ xs: 4 }}
                    textAlign="end"
                    variant="overline">
                    {typedStatus.isFormOpen && (
                        <NumericField
                            disabled={typedStatus.isDisabled || isSubmitting}
                            name="total_payment"
                            numericFormatProps={{
                                InputProps: {
                                    autoComplete: 'off',
                                },
                                inputProps: {
                                    sx: {
                                        autocomplete: 'off',
                                        px: 0.75,
                                        py: 0.5,
                                        textAlign: 'right',
                                    },
                                },
                            }}
                        />
                    )}
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    pl={1}
                    size={{
                        xs: 7,
                    }}
                    textOverflow="ellipsis"
                    variant="overline"
                    whiteSpace="nowrap">
                    Kembalian
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    lineHeight="unset"
                    paddingLeft={2}
                    size={{ xs: 4 }}
                    textAlign="end"
                    variant="overline">
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
                </Grid>
            </Grid>
        </>
    )
}

export default memo(CreateSaleForm)
