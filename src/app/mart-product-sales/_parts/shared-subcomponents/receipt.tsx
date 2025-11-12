// types

// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// vendors
import Image from 'next/image'
// assets
import martLogo from '@/../public/assets/images/belayan-mart-logo.jpg'
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import type ProductMovementDetail from '@/modules/mart/types/orms/product-movement-detail'
import type ProductMovementSale from '@/modules/mart/types/orms/product-movement-sale'
import type ProductMovementWithSale from '@/modules/mart/types/orms/product-movement-with-sale'
import type ActivityLogType from '@/types/orms/activity-log'
import type CashType from '@/types/orms/cash'
// utils
import formatNumber from '@/utils/format-number'
// components
import DefaultItemDesc from './default-item-desc'

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
                '& > *': {
                    fontSize: '0.7em',
                },
                color: 'black !important',
                maxWidth: '80mm',
                textTransform: 'uppercase',
            }}>
            <Typography fontWeight="bold" gutterBottom>
                Struk Penjualan Belayan Mart
            </Typography>

            <Box alignItems="center" display="flex" gap={2}>
                <Image
                    alt="logo" // 6 rem
                    height={96} // 6 rem
                    src={martLogo}
                    width={96}
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

            <Grid alignItems="center" container mt={2} rowSpacing={1.5}>
                {details.map(detail => (
                    <DetailItem data={detail} key={detail.product_id} />
                ))}
            </Grid>

            {costs.length > 0 && (
                <>
                    <Divider
                        sx={{
                            my: 1,
                        }}
                    />

                    <Grid alignItems="center" container>
                        {costs.map(cost => (
                            <CostItem
                                data={cost}
                                key={`${cost.name}-${cost.rp}`}
                            />
                        ))}
                    </Grid>
                </>
            )}

            <Divider
                sx={{
                    bgcolor: 'black',
                    mb: 1,
                }}
            />

            <Grid alignItems="center" container>
                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 8,
                    }}
                    textOverflow="ellipsis"
                    variant="overline">
                    Total
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    variant="overline">
                    {formatNumber(totalDetails + totalCosts)}
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 8,
                    }}
                    textOverflow="ellipsis"
                    variant="overline">
                    Bayar
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    variant="overline">
                    {formatNumber(totalPayment)}
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 8,
                    }}
                    textOverflow="ellipsis"
                    variant="overline">
                    Kembalian
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    lineHeight="unset"
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    variant="overline">
                    {formatNumber(totalPayment - totalDetails + totalCosts)}
                </Grid>
            </Grid>
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
            <Grid
                component={Typography}
                lineHeight="unset"
                size={{
                    xs: 8,
                }}
                textOverflow="ellipsis"
                variant="caption">
                {name}
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                size={{ xs: 1 }}
                textOverflow="ellipsis"
                variant="caption">
                Rp
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                size={{
                    xs: 3,
                }}
                textAlign="end"
                variant="caption">
                {formatNumber(rp)}
            </Grid>
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
            <Grid
                size={{
                    xs: 8,
                }}>
                <Typography lineHeight="unset" variant="overline">
                    {printedProduct?.name}
                </Typography>

                <Typography
                    component="div"
                    lineHeight="unset"
                    variant="caption">
                    {formatNumber(Math.abs(qty))} {printedProduct?.unit} &times;
                    RP {formatNumber(rp_per_unit)}
                </Typography>
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                size={{ xs: 1 }}
                textAlign="end"
                variant="overline">
                Rp
            </Grid>

            <Grid
                component={Typography}
                lineHeight="unset"
                size={{
                    xs: 3,
                }}
                textAlign="end"
                variant="overline">
                {formatNumber(Math.abs(qty) * rp_per_unit)}
            </Grid>
        </>
    )
}
