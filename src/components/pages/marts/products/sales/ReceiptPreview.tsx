// vendors
import { memo } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { Box, BoxProps, Divider, Paper, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Field, FieldProps, useFormikContext } from 'formik'
import Grid2 from '@mui/material/Unstable_Grid2'
// locals
import type { FormValuesType } from '@/pages/marts/products/sales'
import CostsFieldComponent from './ReceiptPreview/CostsFieldComponent'
import CashableUuidFieldComponent from './ReceiptPreview/CashableUuidFieldComponent'
import BuyerUserUuidFieldComponent from './ReceiptPreview/BuyerUserUuidFieldComponent'
import DetailsFieldComponent from './ReceiptPreview/DetailsFieldComponent'
// icons
import SaveIcon from '@mui/icons-material/Save'
// utils
import formatNumber from '@/utils/formatNumber'
// providers
import useAuth from '@/providers/Auth'
import ApiUrl from './ApiUrl'

function ReceiptPreview() {
    const { user } = useAuth()

    const { handleSubmit, isSubmitting } = useFormikContext<FormValuesType>()

    const { data: newNumber } = useSWR<number>(ApiUrl.NEW_SALE_NUMBER)

    return (
        <Paper
            sx={{
                p: 2.5,
            }}>
            <Box display="flex" justifyContent="end">
                <LoadingButton
                    startIcon={<SaveIcon />}
                    color="warning"
                    size="small"
                    onClick={() => handleSubmit()}
                    loading={isSubmitting}>
                    Simpan
                </LoadingButton>
            </Box>

            <DefaultItemDesc desc="TGL" value={dayjs().format('DD-MM-YYYY')} />

            <DefaultItemDesc
                desc="NO. Nota"
                value={newNumber?.toString() ?? ''}
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
                                    acc + qty * rp_per_unit,
                                0,
                            )

                            const totalCosts = formValues.costs.reduce(
                                (acc, { rp }) => acc + (rp ?? 0),
                                0,
                            )

                            return formatNumber(totalDetails + totalCosts)
                        }}
                    />
                </Grid2>
            </Grid2>
        </Paper>
    )
}

export default memo(ReceiptPreview)

function DefaultItemDesc({
    desc,
    value,
    ...props
}: BoxProps & { desc: string; value: string }) {
    return (
        <Box display="flex" gap={1} {...props}>
            <Typography
                variant="caption"
                color="GrayText"
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>
            <Typography variant="caption" component="div">
                {value}
            </Typography>
        </Box>
    )
}
