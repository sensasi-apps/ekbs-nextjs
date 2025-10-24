// vendors

import type { UUID } from 'node:crypto'
// import Image from 'next/image'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import ChipSmall from '@/components/ChipSmall'
// assets
// import martLogo from '@/../public/assets/images/belayan-mart-logo.jpg'
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import type SaleSparePartInstallmentMargin from '@/modules/repair-shop/types/orms/sale_spare_part_installment_margin'
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import formatNumber from '@/utils/format-number'
// utils
import shortUuid from '@/utils/short-uuid'

export default function Receipt({ data }: { data: Sale }) {
    const totalRpSparePart =
        data.spare_part_movement?.details.reduce(
            (acc, { qty, rp_per_unit }) => acc + qty * rp_per_unit * -1,
            0,
        ) ?? 0

    const totalRpService =
        data.sale_services?.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    return (
        <Box
            sx={{
                '* > span': {
                    lineHeight: 1.5,
                },
                '& > *': {
                    fontSize: '0.7em',
                },
                color: 'black !important',
                maxWidth: '80mm',
                textTransform: 'uppercase',
            }}>
            <Typography fontWeight="bold" lineHeight="1em">
                {`${data.finished_at ? 'Struk' : 'Faktur'} Penjualan Belayan Spare Part`}
            </Typography>

            <Typography fontSize="0.5em" variant="overline">
                {data.uuid}
            </Typography>

            <Box alignItems="center" display="flex" gap={2} mb={1} mt={1}>
                {/* <Image
                    width={96} // 6 rem
                    height={96} // 6 rem
                    src={martLogo}
                    alt="logo"
                /> */}

                <Box>
                    <DefaultItemDesc
                        desc="Kode"
                        value={data.uuid ? shortUuid(data.uuid as UUID) : ''}
                    />

                    <DefaultItemDesc desc="Pada" value={data.at ?? ''} />

                    <DefaultItemDesc
                        desc="Kasir"
                        value={data.created_by_user?.name ?? ''}
                    />

                    <DefaultItemDesc
                        desc="Pelanggan"
                        value={
                            data.customer ? (
                                <>
                                    <ChipSmall
                                        color="info"
                                        label={data.customer.id}
                                        sx={{ mr: 1 }}
                                        variant="outlined"
                                    />
                                    {data.customer.name}
                                </>
                            ) : (
                                ''
                            )
                        }
                    />

                    <DefaultItemDesc
                        desc="Metode Pembayaran"
                        value={translatePaymentMethod(data.payment_method)}
                    />
                </Box>
            </Box>

            {data.sale_services && data.sale_services.length > 0 && (
                <Box mt={1}>
                    <Typography fontWeight="bold" variant="overline">
                        Layanan:
                    </Typography>

                    <Grid alignItems="center" container mt={0.5} spacing={0.5}>
                        {data.sale_services.map(service => (
                            <RowGrids
                                desc={service.state.name}
                                key={service.id}
                                value={service.rp ?? 0}
                            />
                        ))}
                    </Grid>
                </Box>
            )}

            {data.spare_part_movement &&
                data.spare_part_movement.details.length > 0 && (
                    <Box mt={1}>
                        <Typography fontWeight="bold" variant="overline">
                            Suku Cadang:
                        </Typography>

                        <Grid
                            alignItems="center"
                            container
                            mt={0.5}
                            spacing={0.5}>
                            {data.spare_part_movement.details.map(detail => (
                                <DetailItem
                                    data={detail}
                                    installmentMargin={data.spare_part_margins?.find(
                                        margin =>
                                            margin.spare_part_warehouse_id ===
                                            detail.spare_part_warehouse_id,
                                    )}
                                    key={detail.id}
                                />
                            ))}
                        </Grid>
                    </Box>
                )}

            <Grid alignItems="center" container mt={1}>
                {Boolean(data.adjustment_rp && data.adjustment_rp > 0) && (
                    <>
                        <RowGrids
                            desc="Subtotal"
                            value={totalRpSparePart + totalRpService}
                        />
                        <RowGrids
                            desc="Penyesuaian"
                            value={data.adjustment_rp}
                        />
                    </>
                )}

                <RowGrids bold desc="Total Akhir" value={data.final_rp} />
            </Grid>
        </Box>
    )
}

function RowGrids({
    desc,
    value,
    bold,
}: {
    desc?: string
    value: number
    bold?: boolean
}) {
    return (
        <>
            <Grid
                component={Typography}
                fontWeight={bold ? 'bold' : 'normal'}
                lineHeight="unset"
                size={{
                    xs: 8,
                }}
                textOverflow="ellipsis"
                variant="overline">
                {desc}
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
                fontWeight={bold ? 'bold' : 'normal'}
                lineHeight="unset"
                size={{
                    xs: 3,
                }}
                textAlign="end"
                variant="overline">
                {formatNumber(value)}
            </Grid>
        </>
    )
}

function DetailItem({
    data,
    installmentMargin,
}: {
    data: SparePartMovement['details'][number]
    installmentMargin: SaleSparePartInstallmentMargin | undefined
}) {
    if (!data) return null

    const { spare_part_state, qty, rp_per_unit } = data
    const { margin_percentage, margin_rp = 0 } = installmentMargin ?? {}

    const qtyDisplay = `${formatNumber(-qty)} ${spare_part_state?.unit}`
    const rpPerUnitDisplayBase = `RP ${formatNumber(rp_per_unit)}`

    const rpPerUnitDisplay =
        margin_percentage !== undefined
            ? `(${rpPerUnitDisplayBase} + ${margin_percentage}%)`
            : rpPerUnitDisplayBase

    const subtotalDisplay = `${formatNumber(Math.ceil(-qty * (rp_per_unit + margin_rp)))}`

    return (
        <>
            <Grid
                size={{
                    xs: 8,
                }}>
                <Typography lineHeight="unset" variant="overline">
                    {spare_part_state?.name}
                </Typography>

                <Typography
                    component="div"
                    fontSize="0.9em"
                    lineHeight="unset"
                    variant="caption">
                    {qtyDisplay} &times; {rpPerUnitDisplay}
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
                {subtotalDisplay}
            </Grid>
        </>
    )
}

function DefaultItemDesc({
    desc,
    value,
}: {
    desc: string
    value: number | string | ReactNode
}) {
    return (
        <Box display="flex" gap={1}>
            <Typography
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}
                variant="caption">
                {desc}
            </Typography>

            <Typography component="div" fontWeight="bold" variant="caption">
                {value}
            </Typography>
        </Box>
    )
}

function translatePaymentMethod(paymentMethod: Sale['payment_method']) {
    return {
        'business-unit': 'Unit Bisnis',
        cash: 'Tunai',
        installment: 'Angsuran',
    }[paymentMethod]
}
