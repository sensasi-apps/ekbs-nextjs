// vendors
import type { UUID } from 'crypto'
// import Image from 'next/image'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// utils
import formatNumber from '@/utils/format-number'
// assets
// import martLogo from '@/../public/assets/images/belayan-mart-logo.jpg'
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import shortUuid from '@/utils/short-uuid'
import type { ReactNode } from 'react'
import ChipSmall from '@/components/ChipSmall'

export default function Receipt({ data }: { data: Sale }) {
    const totalRpSparePart =
        data.spare_part_movement?.details.reduce(
            (acc, { qty, rp_per_unit }) => acc + qty * rp_per_unit * -1,
            0,
        ) ?? 0

    const totalRpService =
        data.sale_services?.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const totalInstallmentRp =
        data.spare_part_margins?.reduce(
            (acc, { margin_rp }) => acc + margin_rp,
            0,
        ) ?? 0 * (data?.installment_parent?.n_term ?? 0)

    return (
        <Box
            sx={{
                color: 'black !important',
                textTransform: 'uppercase',
                maxWidth: '80mm',
                '& > *': {
                    fontSize: '0.7em',
                },
                '* > span': {
                    lineHeight: 1.5,
                },
            }}>
            <Typography fontWeight="bold" lineHeight="1em">
                {`${data.finished_at ? 'Struk' : 'Faktur'} Penjualan Belayan Spare Part`}
            </Typography>

            <Typography variant="overline" fontSize="0.5em">
                {data.uuid}
            </Typography>

            <Box display="flex" gap={2} alignItems="center" mt={1} mb={1}>
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
                                        label={data.customer.id}
                                        color="info"
                                        variant="outlined"
                                        sx={{ mr: 1 }}
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

                    <Grid container alignItems="center" spacing={0.5} mt={0.5}>
                        {data.sale_services.map(service => (
                            <RowGrids
                                key={service.id}
                                desc={service.state.name}
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
                            container
                            alignItems="center"
                            spacing={0.5}
                            mt={0.5}>
                            {data.spare_part_movement.details.map(sparePart => (
                                <DetailItem
                                    key={sparePart.id}
                                    data={sparePart}
                                />
                            ))}
                        </Grid>
                    </Box>
                )}

            <Grid container alignItems="center" mt={1}>
                <RowGrids
                    desc="Subtotal"
                    value={totalRpSparePart + totalRpService}
                />

                {Boolean(data.adjustment_rp && data.adjustment_rp > 0) && (
                    <RowGrids desc="Penyesuaian" value={data.adjustment_rp} />
                )}

                {totalInstallmentRp > 0 && (
                    <RowGrids desc="Jasa Angsuran" value={totalInstallmentRp} />
                )}

                <RowGrids desc="Total Akhir" value={data.final_rp} bold />
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
                size={{
                    xs: 8,
                }}
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontWeight={bold ? 'bold' : 'normal'}
                textOverflow="ellipsis">
                {desc}
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
                fontWeight={bold ? 'bold' : 'normal'}
                lineHeight="unset">
                {formatNumber(value)}
            </Grid>
        </>
    )
}

function DetailItem({ data }: { data: SparePartMovement['details'][number] }) {
    if (!data) return null

    const { spare_part_state, qty, rp_per_unit } = data

    return (
        <>
            <Grid
                size={{
                    xs: 8,
                }}>
                <Typography variant="overline" lineHeight="unset">
                    {spare_part_state?.name}
                </Typography>

                <Typography
                    variant="caption"
                    component="div"
                    lineHeight="unset">
                    {formatNumber(Math.abs(qty ?? 0))} {spare_part_state?.unit}{' '}
                    &times; RP {formatNumber(rp_per_unit ?? 0)}
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
                {formatNumber(Math.abs(qty ?? 0) * (rp_per_unit ?? 0))}
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
                variant="caption"
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>

            <Typography variant="caption" component="div" fontWeight="bold">
                {value}
            </Typography>
        </Box>
    )
}

function translatePaymentMethod(paymentMethod: Sale['payment_method']) {
    return {
        cash: 'Tunai',
        'business-unit': 'Unit Bisnis',
        installment: 'Angsuran',
    }[paymentMethod]
}
