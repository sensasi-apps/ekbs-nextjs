// types
import type ProductSaleType from '@/dataTypes/ProductSale'
// vendors
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import CircularProgress from '@mui/material/CircularProgress'
import Grid2 from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import BackButton from '@/components/BackButton'
import DatePicker from '@/components/DatePicker'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
import { useRouter } from 'next/router'

const apiUrl = 'farm-inputs/product-sales/report'

export default function FarmInputProductSalesReport() {
    const router = useRouter()

    const currDate = dayjs()
    const fromDate = dayjs(router.query.from_date as string)
    const tillDate = dayjs(router.query.till_date as string)

    const { data = [], isLoading } = useSWR<ProductSaleType[]>([
        apiUrl,
        {
            from_date: router.query.from_date ?? currDate.format('YYYY-MM-DD'),
            till_date: router.query.till_date ?? currDate.format('YYYY-MM-DD'),
        },
    ])

    const totalsBaseCostRp: number[] = []
    const totalsProfitRp: number[] = []

    return (
        <AuthLayout title="Laporan Penjualan SAPRODI">
            <BackButton
                size="small"
                sx={{
                    mb: 2,
                }}
            />
            <Grid2 container spacing={2} mb={4}>
                <Grid2>
                    <DatePicker
                        disabled={isLoading}
                        label="Dari Tanggal"
                        minDate={dayjs('2020-01-01')}
                        maxDate={tillDate}
                        value={fromDate}
                        onChange={value =>
                            router.replace({
                                query: {
                                    from_date: value?.format('YYYY-MM-DD'),
                                    till_date:
                                        router.query.till_date ??
                                        currDate.format('YYYY-MM-DD'),
                                },
                            })
                        }
                        slotProps={{
                            textField: {
                                margin: 'none',
                            },
                        }}
                    />
                </Grid2>
                <Grid2>
                    <DatePicker
                        disabled={isLoading}
                        label="Hingga Tanggal"
                        minDate={fromDate}
                        maxDate={currDate}
                        value={tillDate}
                        onChange={value =>
                            router.replace({
                                query: {
                                    from_date:
                                        router.query.from_date ??
                                        currDate.format('YYYY-MM-DD'),
                                    till_date: value?.format('YYYY-MM-DD'),
                                },
                            })
                        }
                        slotProps={{
                            textField: {
                                margin: 'none',
                            },
                        }}
                    />
                </Grid2>
                <Grid2 display="flex" gap={1}>
                    <Tooltip title="unduh excel" placement="top" arrow>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <IconButton
                                color="success"
                                disabled={isLoading}
                                href={`${
                                    process.env.NEXT_PUBLIC_BACKEND_URL
                                }/${apiUrl}?from_date=${fromDate?.format(
                                    'YYYY-MM-DD',
                                )}&till_date=${tillDate?.format(
                                    'YYYY-MM-DD',
                                )}&excel=true`}
                                download>
                                <BackupTableIcon />
                            </IconButton>
                        )}
                    </Tooltip>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Pengguna</TableCell>
                            <TableCell>Metode Pembayaran</TableCell>
                            <TableCell>Biaya Dasar</TableCell>
                            <TableCell>Penjualan</TableCell>
                            <TableCell>Subtotal Biaya Dasar</TableCell>
                            <TableCell>Subtotal Penjualan</TableCell>
                            <TableCell>Penyesuaian/Jasa</TableCell>
                            <TableCell>Total Penjualan</TableCell>
                            <TableCell>Keuntungan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    sx={{
                                        textAlign: 'center',
                                    }}>
                                    {isLoading ? (
                                        <i>Memuat data...</i>
                                    ) : (
                                        'Tidak ada data'
                                    )}
                                </TableCell>
                            </TableRow>
                        )}

                        {data.map(productSale => {
                            const totalBaseCostRp =
                                productSale.product_movement_details.reduce(
                                    (acc, pmd) =>
                                        acc +
                                        pmd.qty *
                                            -1 *
                                            pmd.product_state
                                                .base_cost_rp_per_unit,
                                    0,
                                )

                            const adjustmentOrInterestRp =
                                productSale.total_rp - productSale.total_base_rp

                            const profit =
                                productSale.total_rp - totalBaseCostRp

                            totalsBaseCostRp.push(totalBaseCostRp)
                            totalsProfitRp.push(profit)

                            return (
                                <TableRow key={productSale.uuid}>
                                    <TableCell>
                                        {toDmy(productSale.at)}
                                    </TableCell>
                                    <TableCell>
                                        {productSale.buyer_user
                                            ? `#${productSale.buyer_user.id} ${productSale.buyer_user.name}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {productSale.payment_method_id}
                                    </TableCell>
                                    <TableCell>
                                        <ul
                                            style={{
                                                margin: 0,
                                                paddingLeft: '1em',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {productSale.product_movement_details.map(
                                                ({
                                                    id,
                                                    qty = 0,
                                                    product_state,
                                                }) => (
                                                    <li key={id}>
                                                        {formatNumber(
                                                            Math.abs(qty),
                                                        )}{' '}
                                                        {product_state.unit}{' '}
                                                        {product_state.name}{' '}
                                                        &times;{' '}
                                                        {numberToCurrency(
                                                            product_state.base_cost_rp_per_unit ??
                                                                0,
                                                        )}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                        <ul
                                            style={{
                                                margin: 0,
                                                paddingLeft: '1em',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {productSale.product_movement_details.map(
                                                ({
                                                    id,
                                                    qty,
                                                    product_state,
                                                    rp_per_unit,
                                                }) => (
                                                    <li key={id}>
                                                        {formatNumber(
                                                            Math.abs(qty) ?? 0,
                                                        )}{' '}
                                                        {product_state?.unit}{' '}
                                                        {product_state?.name}{' '}
                                                        &times;{' '}
                                                        {numberToCurrency(
                                                            rp_per_unit ?? 0,
                                                        )}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                        {numberToCurrency(totalBaseCostRp)}
                                    </TableCell>
                                    <TableCell>
                                        {numberToCurrency(
                                            productSale.total_base_rp,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {numberToCurrency(
                                            adjustmentOrInterestRp,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {numberToCurrency(productSale.total_rp)}
                                    </TableCell>
                                    <TableCell>
                                        {numberToCurrency(profit)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>GRAND TOTAL</TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    totalsBaseCostRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    data.reduce(
                                        (acc, row) => acc + row.total_base_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    data.reduce(
                                        (acc, row) =>
                                            acc +
                                            row.total_rp -
                                            row.total_base_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    data.reduce(
                                        (acc, row) => acc + row.total_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    totalsProfitRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ),
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </AuthLayout>
    )
}
