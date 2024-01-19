// types
import type ProductSaleType from '@/dataTypes/ProductSale'
import type { Dayjs } from 'dayjs'
// vendors
import dayjs from 'dayjs'
import { useState } from 'react'
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

const apiUrl = 'farm-inputs/product-sales/report'

export default function FarmInputProductSalesReport() {
    const currDate = dayjs()

    const [fromDate, setFromDate] = useState<Dayjs | null>(currDate)
    const [tillDate, setTillDate] = useState<Dayjs | null>(currDate)
    const { data = [], isLoading } = useSWR<ProductSaleType[]>([
        apiUrl,
        {
            from_date: fromDate?.format('YYYY-MM-DD'),
            till_date: tillDate?.format('YYYY-MM-DD'),
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
                        label="Dari Tanggal"
                        minDate={dayjs('2020-01-01')}
                        maxDate={currDate}
                        value={fromDate}
                        onChange={value => setFromDate(value)}
                        slotProps={{
                            textField: {
                                margin: 'none',
                            },
                        }}
                    />
                </Grid2>
                <Grid2>
                    <DatePicker
                        label="Hingga Tanggal"
                        minDate={fromDate ?? dayjs('2020-01-01')}
                        maxDate={currDate}
                        defaultValue={currDate}
                        value={tillDate}
                        onChange={value => setTillDate(value)}
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
                            <TableCell>Total</TableCell>
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
                                    (acc, pmd) => {
                                        const product =
                                            productSale.products_state.find(
                                                p => pmd.product_id === p.id,
                                            )

                                        return (
                                            acc +
                                            pmd.qty *
                                                -1 *
                                                (product?.base_cost_rp_per_unit ??
                                                    0)
                                        )
                                    },
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
                                        {translatePaymentMethod(
                                            productSale.payment_method,
                                            productSale.n_term,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <ul
                                            style={{
                                                margin: 0,
                                                paddingLeft: '1em',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {productSale.product_movement_details.map(
                                                pmd => {
                                                    const product =
                                                        productSale.products_state.find(
                                                            p =>
                                                                pmd.product_id ===
                                                                p.id,
                                                        )

                                                    return (
                                                        <li
                                                            key={
                                                                pmd.product_id
                                                            }>
                                                            {formatNumber(
                                                                Math.abs(
                                                                    pmd.qty,
                                                                ) ?? 0,
                                                            )}{' '}
                                                            {product?.unit}{' '}
                                                            {product?.name}{' '}
                                                            &times;{' '}
                                                            {numberToCurrency(
                                                                product?.base_cost_rp_per_unit ??
                                                                    0,
                                                            )}
                                                        </li>
                                                    )
                                                },
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
                                                pmd => {
                                                    const product =
                                                        productSale.products_state.find(
                                                            p =>
                                                                pmd.product_id ===
                                                                p.id,
                                                        )

                                                    return (
                                                        <li
                                                            key={
                                                                pmd.product_id
                                                            }>
                                                            {formatNumber(
                                                                Math.abs(
                                                                    pmd.qty,
                                                                ) ?? 0,
                                                            )}{' '}
                                                            {product?.unit}{' '}
                                                            {product?.name}{' '}
                                                            &times;{' '}
                                                            {numberToCurrency(
                                                                pmd.rp_per_unit ??
                                                                    0,
                                                            )}
                                                        </li>
                                                    )
                                                },
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
                            <TableCell colSpan={4}>GRAND TOTAL</TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    totalsBaseCostRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell></TableCell>
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

function translatePaymentMethod(
    og: 'cash' | 'installment' | 'wallet',
    n_term: number | undefined,
) {
    if (og === 'cash') return 'Tunai'
    if (og === 'installment') return `Potong TBS (${n_term}x)`

    return 'Wallet'
}
