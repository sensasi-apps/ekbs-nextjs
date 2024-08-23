// types
import type ProductMovementSale from '@/dataTypes/mart/ProductMovementSale'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type ActivityLogType from '@/dataTypes/ActivityLog'
import type CashType from '@/dataTypes/Cash'
import type ProductMovementWithSale from '@/dataTypes/mart/ProductMovementWithSale'
// vendors
import { Box, Divider, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
// components
import DefaultItemDesc from './DefaultItemDesc'
// utils
import formatNumber from '@/utils/formatNumber'
import LogoImage from '@/../public/assets/images/belayan-mart-logo.jpg'

export default function Receipt({
    data: {
        at,
        saleNo,
        saleBuyerUser,
        details,
        costs,
        transactionCashName,
        servedByUserName,
    },
}: {
    data: {
        at: ProductMovement['at']
        saleNo: ProductMovementSale['no']
        details: ProductMovement['details']
        costs: ProductMovement['costs']
        transactionCashName: CashType['name']

        saleBuyerUser: ProductMovementSale['buyer_user']
        servedByUserName: ActivityLogType['user']['name']
    }
}) {
    const totalDetails = details.reduce(
        (acc, { qty, rp_per_unit }) => acc + qty * rp_per_unit,
        0,
    )

    const totalCosts = costs.reduce((acc, { rp }) => acc + (rp ?? 0), 0)

    const costumerName = saleBuyerUser
        ? `#${saleBuyerUser.id} — ${saleBuyerUser.name}`
        : '-'

    return (
        <>
            <Typography gutterBottom>Struk Penjualan Belayan Mart</Typography>

            <Box display="flex" gap={2} alignItems="center">
                <Image
                    src={LogoImage}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                />

                <Box>
                    <DefaultItemDesc desc="TGL" value={at} />

                    <DefaultItemDesc
                        desc="NO. Nota"
                        value={saleNo.toString()}
                    />

                    <DefaultItemDesc desc="Kasir" value={servedByUserName} />

                    <DefaultItemDesc desc="Pelanggan" value={costumerName} />

                    <DefaultItemDesc
                        desc="Pembayaran Ke"
                        value={transactionCashName}
                    />
                </Box>
            </Box>

            <Grid2 container mt={3} alignItems="center" spacing={4}>
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
                    xs={3}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    {formatNumber(totalDetails + totalCosts)}
                </Grid2>
            </Grid2>
        </>
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
                variant="caption"
                pl={1}>
                {name}
            </Grid2>

            <Grid2
                xs={1}
                component={Typography}
                lineHeight="unset"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                variant="caption"
                pl={1}>
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
    data: ProductMovementWithSale['details'][0]
}) {
    const printedProduct = product_state ?? product

    return (
        <>
            <Grid2 xs={8} pl={1}>
                <Typography
                    variant="overline"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    lineHeight="normal">
                    {printedProduct?.name}
                </Typography>
                <Typography variant="caption" component="div">
                    {formatNumber(qty)} {printedProduct?.unit} &times; RP{' '}
                    {formatNumber(rp_per_unit)}
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
                {formatNumber(qty * rp_per_unit)}
            </Grid2>
        </>
    )
}
