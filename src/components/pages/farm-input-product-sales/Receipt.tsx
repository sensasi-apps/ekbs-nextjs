// types
import type ProductSaleType from '@/dataTypes/ProductSale'
import type { ReactNode } from 'react'
// vendors
import { memo } from 'react'
import Image from 'next/image'
// materials
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
// components
import ReceiptInstalmentTable from '@/components/pages/farm-input-product-sales/Receipt/InstallmentTable'
// utils
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'
import dayjs from 'dayjs'

const ProductSaleReceipt = memo(function ProductSaleReceipt({
    data,
}: {
    data: ProductSaleType
}) {
    const {
        uuid,
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
            <Box display="flex" my={2} gap={3} alignItems="center">
                <Image
                    src="/assets/pwa-icons/green-transparent.svg"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                    priority
                />

                <Box>
                    <Typography variant="h6">Nota Penjualan</Typography>
                    <Typography variant="caption" component="div">
                        {toDmy(at)}
                    </Typography>
                    <Typography variant="caption" component="div">
                        {uuid}
                    </Typography>
                </Box>
            </Box>

            <Grid2 container columnSpacing={1} mb={2.5}>
                <RowTextGrids
                    title="Pelanggan"
                    value={
                        buyer_user
                            ? `#${buyer_user.id} ${buyer_user.name}`
                            : '-'
                    }
                />

                <RowTextGrids title="Pembayaran" value={paymentMethodId} />

                <RowTextGrids
                    title="Kasir"
                    value={user_activity_logs?.[0]?.user?.name}
                />
            </Grid2>

            <Typography
                variant="caption"
                component="div"
                textAlign="center"
                fontWeight="bold"
                mb={0.5}>
                DAFTAR BARANG
            </Typography>

            {product_movement_details.map(
                ({
                    qty,
                    product_id,
                    rp_per_unit,
                    product_state: { name, unit },
                }) => (
                    <Grid2
                        key={product_id}
                        container
                        mb={0.5}
                        alignItems="center">
                        <Grid2
                            xs={2}
                            textAlign="center"
                            textTransform="uppercase"
                            component={Typography}
                            variant="overline"
                            lineHeight="unset"
                            fontSize="1em">
                            {formatNumber(Math.abs(qty))} {unit}
                        </Grid2>

                        <Grid2
                            xs={6}
                            component={Typography}
                            variant="overline"
                            lineHeight="unset"
                            fontSize="1em"
                            whiteSpace="nowrap"
                            overflow="hidden">
                            {name}
                            <Typography variant="caption" component="div">
                                @ RP {formatNumber(rp_per_unit)}
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
                    </Grid2>
                ),
            )}

            <Grid2 container rowSpacing={0.5} alignItems="center">
                {Boolean(adjustment_rp) && (
                    <>
                        <Grid2 xs={2} />

                        <Grid2 xs={6} component={Typography} variant="caption">
                            PENYESUAIAN
                        </Grid2>

                        <Grid2
                            xs={1}
                            textAlign="end"
                            component={Typography}
                            variant="caption">
                            Rp
                        </Grid2>

                        <Grid2
                            xs={3}
                            textAlign="end"
                            component={Typography}
                            variant="caption">
                            {formatNumber(adjustment_rp ?? 0)}
                        </Grid2>
                    </>
                )}

                {payment_method === 'installment' && (
                    <>
                        <Grid2 xs={2} />

                        <Grid2 xs={6} component={Typography} variant="caption">
                            Jasa ({interest_percent}% &times; {n_term}{' '}
                            {n_term_unit})
                        </Grid2>

                        <Grid2
                            xs={1}
                            textAlign="end"
                            component={Typography}
                            variant="caption">
                            Rp
                        </Grid2>

                        <Grid2
                            xs={3}
                            textAlign="end"
                            component={Typography}
                            variant="caption">
                            {formatNumber(total_rp - total_base_rp)}
                        </Grid2>
                    </>
                )}

                {/* footer */}
                <Grid2 xs={8} textAlign="center">
                    <Typography variant="caption" fontWeight="bold">
                        TOTAL KESELURUHAN
                    </Typography>
                </Grid2>

                <Grid2
                    xs={1}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    fontSize="1em"
                    fontWeight="bold">
                    Rp
                </Grid2>

                <Grid2
                    xs={3}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    fontSize="1em"
                    fontWeight="bold">
                    {formatNumber(total_rp)}
                </Grid2>
            </Grid2>

            {payment_method === 'installment' && (
                <>
                    <Typography
                        variant="caption"
                        component="div"
                        textAlign="center"
                        fontWeight="bold"
                        mt={3}
                        mb={0.5}>
                        RINCIAN POTONGAN TBS
                    </Typography>
                    <ReceiptInstalmentTable data={data} />
                </>
            )}

            <Box
                mt={2}
                sx={{
                    '*': {
                        lineHeight: '1em',
                    },
                }}>
                <Typography variant="body2">
                    Desa Muai, {dayjs(at).format('D MMMM YYYY')}
                </Typography>

                <Typography variant="body2" mb={6}>
                    Pembeli
                </Typography>

                <Typography variant="body2" textTransform="capitalize">
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
        <Grid2 xs={2}>
            <Typography variant="caption" component="div">
                {title}
            </Typography>
        </Grid2>

        <Grid2 xs={1} textAlign="end">
            <Typography variant="caption" component="div">
                :
            </Typography>
        </Grid2>

        <Grid2 xs={9}>
            <Typography fontWeight="bold">{value}</Typography>
        </Grid2>
    </>
)
