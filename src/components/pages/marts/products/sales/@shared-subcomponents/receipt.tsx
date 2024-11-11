// types
import type ActivityLogType from '@/dataTypes/ActivityLog'
import type CashType from '@/dataTypes/Cash'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import type ProductMovementSale from '@/dataTypes/mart/product-movement-sale'
import type ProductMovementWithSale from '@/dataTypes/mart/product-movement-with-sale'
// vendors
import { Box, Divider, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import DefaultItemDesc from './default-item-desc'
// utils
import formatNumber from '@/utils/formatNumber'

export default function Receipt({
    data: {
        at,
        saleNo,
        saleBuyerUser,
        details,
        costs,
        transactionCashName,
        servedByUserName,
        totalPayment,
    },
}: {
    data: {
        at: ProductMovement['at']
        saleNo?: ProductMovementSale['no']
        details: Omit<ProductMovementDetail, 'id'>[]
        costs: ProductMovement['costs']
        transactionCashName: CashType['name']
        totalPayment: ProductMovementSale['total_payment']

        saleBuyerUser: ProductMovementSale['buyer_user']
        servedByUserName: ActivityLogType['user']['name']
    }
}) {
    const totalDetails = details.reduce(
        (acc, { qty, rp_per_unit }) => acc + Math.abs(qty) * rp_per_unit,
        0,
    )

    const totalCosts = costs.reduce((acc, { rp }) => acc + (rp ?? 0), 0)

    const costumerName = saleBuyerUser
        ? `#${saleBuyerUser.id} — ${saleBuyerUser.name}`
        : '-'

    return (
        <Box
            sx={{
                color: 'black !important',
                textTransform: 'uppercase',
            }}>
            <Typography gutterBottom fontWeight="bold">
                Struk Penjualan Belayan Mart
            </Typography>

            <Box display="flex" gap={2} alignItems="center">
                <img
                    src="/assets/images/belayan-mart-logo.jpg"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                />

                <Box>
                    {saleNo && (
                        <DefaultItemDesc
                            desc="NO. Nota"
                            value={saleNo ?? '-'}
                        />
                    )}

                    <DefaultItemDesc desc="Pada" value={at} />

                    <DefaultItemDesc desc="Kasir" value={servedByUserName} />

                    <DefaultItemDesc desc="Pelanggan" value={costumerName} />

                    <DefaultItemDesc
                        desc="Pembayaran Ke"
                        value={transactionCashName}
                    />
                </Box>
            </Box>

            <Grid2 container mt={2} alignItems="center" rowSpacing={1.5}>
                {details.map((detail, index) => (
                    <DetailItem key={index} data={detail} />
                ))}
            </Grid2>

            {costs.length > 0 && (
                <>
                    <Divider
                        sx={{
                            my: 1,
                        }}
                    />

                    <Grid2 container alignItems="center">
                        {costs.map((cost, index) => (
                            <CostItem key={index} data={cost} />
                        ))}
                    </Grid2>
                </>
            )}

            <Divider
                sx={{
                    my: 1,
                    bgcolor: 'black',
                }}
            />

            <Grid2 container alignItems="center">
                <Grid2
                    xs={8}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
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
                    xs={3}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    {formatNumber(totalDetails + totalCosts)}
                </Grid2>

                <Grid2
                    xs={8}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
                    Bayar
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
                    xs={3}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    {formatNumber(totalPayment)}
                </Grid2>

                <Grid2
                    xs={8}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
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
                    xs={3}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    {formatNumber(totalPayment - totalDetails + totalCosts)}
                </Grid2>
            </Grid2>
        </Box>
    )
}

function CostItem({
    data: { name, rp },
}: {
    data: ProductMovementWithSale['costs'][0]
}) {
    return (
        <>
            <Grid2
                xs={8}
                component={Typography}
                lineHeight="unset"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                variant="caption">
                {name}
            </Grid2>

            <Grid2
                xs={1}
                component={Typography}
                lineHeight="unset"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                variant="caption">
                Rp
            </Grid2>

            <Grid2
                xs={3}
                textAlign="end"
                component={Typography}
                variant="caption"
                lineHeight="unset">
                {formatNumber(rp)}
            </Grid2>
        </>
    )
}

function DetailItem({
    data: { product, qty, rp_per_unit, product_state },
}: {
    data: Omit<ProductMovementWithSale['details'][0], 'id'>
}) {
    const printedProduct = product_state ?? product

    return (
        <>
            <Grid2 xs={8}>
                <Typography
                    variant="overline"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    lineHeight="1em">
                    {printedProduct?.name}
                </Typography>

                <Typography variant="caption" component="div" lineHeight="1em">
                    {formatNumber(Math.abs(qty))} {printedProduct?.unit} &times;
                    RP {formatNumber(rp_per_unit)}
                </Typography>
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
                xs={3}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1em">
                {formatNumber(Math.abs(qty) * rp_per_unit)}
            </Grid2>
        </>
    )
}
