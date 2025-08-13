// types
import type ActivityLogType from '@/dataTypes/ActivityLog'
import type CashType from '@/dataTypes/Cash'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import type ProductMovementSale from '@/dataTypes/mart/product-movement-sale'
import type ProductMovementWithSale from '@/dataTypes/mart/product-movement-with-sale'
// vendors
import Image from 'next/image'
// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// components
import DefaultItemDesc from './default-item-desc'
// utils
import formatNumber from '@/utils/format-number'
// assets
import martLogo from '@/../public/assets/images/belayan-mart-logo.jpg'

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
                maxWidth: '80mm',
                '& > *': {
                    fontSize: '0.7em',
                },
            }}>
            <Typography gutterBottom fontWeight="bold">
                Struk Penjualan Belayan Mart
            </Typography>

            <Box display="flex" gap={2} alignItems="center">
                <Image
                    width={96} // 6 rem
                    height={96} // 6 rem
                    src={martLogo}
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

            <Grid container mt={2} alignItems="center" rowSpacing={1.5}>
                {details.map((detail, index) => (
                    <DetailItem key={index} data={detail} />
                ))}
            </Grid>

            {costs.length > 0 && (
                <>
                    <Divider
                        sx={{
                            my: 1,
                        }}
                    />

                    <Grid container alignItems="center">
                        {costs.map((cost, index) => (
                            <CostItem key={index} data={cost} />
                        ))}
                    </Grid>
                </>
            )}

            <Divider
                sx={{
                    mb: 1,
                    bgcolor: 'black',
                }}
            />

            <Grid container alignItems="center">
                <Grid
                    size={{
                        xs: 8,
                    }}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    textOverflow="ellipsis">
                    Total
                </Grid>

                <Grid
                    size={{ xs: 1 }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
                    Rp
                </Grid>

                <Grid
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
                    {formatNumber(totalDetails + totalCosts)}
                </Grid>

                <Grid
                    size={{
                        xs: 8,
                    }}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    textOverflow="ellipsis">
                    Bayar
                </Grid>

                <Grid
                    size={{ xs: 1 }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
                    Rp
                </Grid>

                <Grid
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
                    {formatNumber(totalPayment)}
                </Grid>

                <Grid
                    size={{
                        xs: 8,
                    }}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    textOverflow="ellipsis">
                    Kembalian
                </Grid>

                <Grid
                    size={{ xs: 1 }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
                    Rp
                </Grid>

                <Grid
                    size={{
                        xs: 3,
                    }}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset">
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
                size={{
                    xs: 8,
                }}
                component={Typography}
                lineHeight="unset"
                textOverflow="ellipsis"
                variant="caption">
                {name}
            </Grid>

            <Grid
                size={{ xs: 1 }}
                component={Typography}
                lineHeight="unset"
                textOverflow="ellipsis"
                variant="caption">
                Rp
            </Grid>

            <Grid
                size={{
                    xs: 3,
                }}
                textAlign="end"
                component={Typography}
                variant="caption"
                lineHeight="unset">
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
                <Typography variant="overline" lineHeight="unset">
                    {printedProduct?.name}
                </Typography>

                <Typography
                    variant="caption"
                    component="div"
                    lineHeight="unset">
                    {formatNumber(Math.abs(qty))} {printedProduct?.unit} &times;
                    RP {formatNumber(rp_per_unit)}
                </Typography>
            </Grid>

            <Grid
                size={{ xs: 1 }}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset">
                Rp
            </Grid>

            <Grid
                size={{
                    xs: 3,
                }}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset">
                {formatNumber(Math.abs(qty) * rp_per_unit)}
            </Grid>
        </>
    )
}
