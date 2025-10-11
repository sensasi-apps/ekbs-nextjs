// types

// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import Image from 'next/image'
import type { ReactNode } from 'react'
// vendors
import { memo } from 'react'
// components
import ReceiptInstalmentTable from '@/components/pages/farm-input-product-sales/Receipt/InstallmentTable'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import formatNumber from '@/utils/format-number'
// utils
import toDmy from '@/utils/to-dmy'

const ProductSaleReceipt = memo(function ProductSaleReceipt({
    data,
}: {
    data: ProductSaleORM
}) {
    const {
        uuid,
        short_uuid,
        at,
        payment_method,
        buyer_user,
        user_activity_logs,
        total_rp,
        total_base_rp,
        adjustment_rp,
        product_movement_details,
        n_term,
        n_term_unit,
        interest_percent,
    } = data

    const paymentMethodId =
        payment_method === 'cash'
            ? 'Tunai'
            : payment_method === 'installment'
              ? `Potong TBS (${n_term}x)`
              : payment_method === 'wallet'
                ? 'E-Wallet'
                : payment_method === 'businessUnit'
                  ? 'Kas Unit Bisnis'
                  : '-'

    return (
        <Box>
            <Box alignItems="center" display="flex" gap={3}>
                <Image
                    alt="logo"
                    height={0}
                    priority
                    sizes="100vw"
                    src="/assets/pwa-icons/green-transparent.svg"
                    style={{ height: '6em', width: '6em' }}
                    width={0}
                />

                <Box>
                    <Typography variant="h6">Nota Penjualan</Typography>
                    <Typography component="div" variant="caption">
                        {toDmy(at)}
                    </Typography>
                    <Typography component="div" variant="caption">
                        {uuid}
                    </Typography>
                </Box>
            </Box>

            <Grid columnSpacing={1} container mb={2.5}>
                <RowTextGrids title="Kode" value={short_uuid} />

                <RowTextGrids
                    title="Pelanggan"
                    value={
                        buyer_user
                            ? `#${buyer_user.id} — ${buyer_user.name}`
                            : '-'
                    }
                />

                <RowTextGrids title="Pembayaran" value={paymentMethodId} />

                <RowTextGrids
                    title="Kasir"
                    value={user_activity_logs?.[0]?.user?.name}
                />
            </Grid>

            <Typography
                component="div"
                fontWeight="bold"
                mb={0.5}
                textAlign="center"
                variant="caption">
                DAFTAR BARANG
            </Typography>

            {product_movement_details.map(
                ({
                    qty,
                    product_id,
                    rp_per_unit,
                    product_state: { name, unit },
                }) => (
                    <Grid
                        alignItems="center"
                        container
                        key={product_id}
                        mb={0.5}>
                        <Grid
                            component={Typography}
                            fontSize="1em"
                            lineHeight="unset"
                            size={{ xs: 2 }}
                            textAlign="center"
                            textTransform="uppercase"
                            variant="overline">
                            {formatNumber(Math.abs(qty))} {unit}
                        </Grid>

                        <Grid
                            component={Typography}
                            fontSize="1em"
                            lineHeight="unset"
                            overflow="hidden"
                            size={{ xs: 6 }}
                            variant="overline"
                            whiteSpace="nowrap">
                            {name}
                            <Typography component="div" variant="caption">
                                @ RP {formatNumber(rp_per_unit)}
                            </Typography>
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
                            size={{ xs: 3 }}
                            textAlign="end"
                            variant="overline">
                            {formatNumber(Math.abs(qty) * rp_per_unit)}
                        </Grid>
                    </Grid>
                ),
            )}

            <Grid alignItems="center" container rowSpacing={0.5}>
                {Boolean(adjustment_rp) && (
                    <>
                        <Grid size={{ xs: 2 }} />

                        <Grid
                            component={Typography}
                            size={{ xs: 6 }}
                            variant="caption">
                            PENYESUAIAN
                        </Grid>

                        <Grid
                            component={Typography}
                            size={{ xs: 1 }}
                            textAlign="end"
                            variant="caption">
                            Rp
                        </Grid>

                        <Grid
                            component={Typography}
                            size={{ xs: 3 }}
                            textAlign="end"
                            variant="caption">
                            {formatNumber(adjustment_rp ?? 0)}
                        </Grid>
                    </>
                )}

                {payment_method === 'installment' && (
                    <>
                        <Grid size={{ xs: 2 }} />

                        <Grid
                            component={Typography}
                            size={{ xs: 6 }}
                            variant="caption">
                            Jasa ({interest_percent}% &times; {n_term}{' '}
                            {n_term_unit})
                        </Grid>

                        <Grid
                            component={Typography}
                            size={{ xs: 1 }}
                            textAlign="end"
                            variant="caption">
                            Rp
                        </Grid>

                        <Grid
                            component={Typography}
                            size={{ xs: 3 }}
                            textAlign="end"
                            variant="caption">
                            {formatNumber(total_rp - total_base_rp)}
                        </Grid>
                    </>
                )}

                {/* footer */}
                <Grid size={{ xs: 8 }} textAlign="center">
                    <Typography fontWeight="bold" variant="caption">
                        TOTAL KESELURUHAN
                    </Typography>
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    fontWeight="bold"
                    size={{ xs: 1 }}
                    textAlign="end"
                    variant="overline">
                    Rp
                </Grid>

                <Grid
                    component={Typography}
                    fontSize="1em"
                    fontWeight="bold"
                    size={{ xs: 3 }}
                    textAlign="end"
                    variant="overline">
                    {formatNumber(total_rp)}
                </Grid>
            </Grid>

            {payment_method === 'installment' && (
                <>
                    <Typography
                        component="div"
                        fontWeight="bold"
                        mb={0.5}
                        mt={3}
                        textAlign="center"
                        variant="caption">
                        RINCIAN POTONGAN TBS
                    </Typography>

                    <ReceiptInstalmentTable data={data} />
                </>
            )}

            <Box
                mt={4}
                sx={{
                    '*': {
                        lineHeight: '1em',
                    },
                }}>
                <Typography variant="body2">
                    Desa Muai, {dayjs(at).format('D MMMM YYYY')}
                </Typography>

                <Typography mb={6} variant="body2">
                    Pembeli
                </Typography>

                <Typography textTransform="capitalize" variant="body2">
                    #{buyer_user?.id} &mdash; {buyer_user?.name.toLowerCase()}
                </Typography>
            </Box>
        </Box>
    )
})

export default ProductSaleReceipt

const RowTextGrids = ({
    title,
    value,
}: {
    title: ReactNode
    value: ReactNode
}) => (
    <>
        <Grid size={{ xs: 2 }}>
            <Typography component="div" variant="caption">
                {title}
            </Typography>
        </Grid>

        <Grid size={{ xs: 1 }} textAlign="end">
            <Typography component="div" variant="caption">
                :
            </Typography>
        </Grid>

        <Grid size={{ xs: 9 }}>
            <Typography fontWeight="bold">{value}</Typography>
        </Grid>
    </>
)
