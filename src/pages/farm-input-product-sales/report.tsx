// types
import type ProductMovementDetail from '@/dataTypes/ProductMovementDetail'
import type ProductSaleType from '@/dataTypes/ProductSale'
// vendors
import { useRouter } from 'next/router'
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
import Typography from '@mui/material/Typography'
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
import ucWords from '@/utils/ucWords'

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
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Gudang</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Pengguna</TableCell>
                            <TableCell>Metode Pembayaran</TableCell>
                            <TableCell>Biaya Dasar / HPP</TableCell>
                            <TableCell>Total Biaya Dasar / HPP (RP)</TableCell>
                            <TableCell>Penjualan</TableCell>
                            <TableCell>Subtotal Penjualan (RP)</TableCell>
                            <TableCell>Penyesuaian/Jasa (RP)</TableCell>
                            <TableCell>Total Penjualan (RP)</TableCell>
                            <TableCell>Marjin (RP)</TableCell>
                            <TableCell>Marjin (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& td': {
                                whiteSpace: 'nowrap',
                            },
                        }}>
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

                        {data.map((productSale, i) => {
                            const totalBaseCostRp =
                                productSale.product_movement_details.reduce(
                                    (acc, pmd) =>
                                        acc +
                                        pmd.qty *
                                            -1 *
                                            pmd.product_warehouse_state
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
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                        {ucWords(
                                            productSale.product_movement
                                                .warehouse,
                                        )}
                                    </TableCell>
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
                                        {pmdsCostCustomBodyRender(
                                            productSale.product_movement_details,
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatNumber(totalBaseCostRp)}
                                    </TableCell>
                                    <TableCell>
                                        {pmdsSaleCustomBodyRender(
                                            productSale.product_movement_details,
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            productSale.total_base_rp,
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatNumber(adjustmentOrInterestRp)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(productSale.total_rp)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(profit)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            (profit / productSale.total_rp) *
                                                100,
                                        )}
                                        %
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6}>GRAND TOTAL</TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    totalsBaseCostRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ),
                                )}
                            </TableCell>
                            <TableCell />

                            <TableCell align="right">
                                {formatNumber(
                                    data.reduce(
                                        (acc, row) => acc + row.total_base_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {formatNumber(
                                    data.reduce(
                                        (acc, row) =>
                                            acc +
                                            row.total_rp -
                                            row.total_base_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {formatNumber(
                                    data.reduce(
                                        (acc, row) => acc + row.total_rp,
                                        0,
                                    ),
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {formatNumber(
                                    totalsProfitRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ),
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {formatNumber(
                                    (totalsProfitRp.reduce(
                                        (acc, curr) => acc + curr,
                                        0,
                                    ) /
                                        data.reduce(
                                            (acc, row) => acc + row.total_rp,
                                            0,
                                        )) *
                                        100,
                                )}
                                %
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </AuthLayout>
    )
}

const pmdsSaleCustomBodyRender = (pids: ProductMovementDetail[]) => (
    <ul
        style={{
            margin: 0,
            paddingLeft: '1em',
            whiteSpace: 'nowrap',
        }}>
        {pids?.map(
            ({ id, qty, rp_per_unit, product_state: { name, unit } }) => (
                <Typography
                    key={id}
                    variant="overline"
                    component="li"
                    lineHeight="unset">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: name,
                        }}
                    />{' '}
                    &mdash; {formatNumber(qty * -1)} {unit} &times;{' '}
                    {numberToCurrency(rp_per_unit)} ={' '}
                    {numberToCurrency(qty * -1 * rp_per_unit)}
                </Typography>
            ),
        )}
    </ul>
)

const pmdsCostCustomBodyRender = (pids: ProductMovementDetail[]) => (
    <ul
        style={{
            margin: 0,
            paddingLeft: '1em',
            whiteSpace: 'nowrap',
        }}>
        {pids?.map(
            ({
                id,
                qty,
                product_state: { name, unit },
                product_warehouse_state: { base_cost_rp_per_unit },
            }) => (
                <Typography
                    key={id}
                    variant="overline"
                    component="li"
                    lineHeight="unset">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: name,
                        }}
                    />{' '}
                    &mdash; {formatNumber(qty * -1)} {unit} &times;{' '}
                    {numberToCurrency(base_cost_rp_per_unit)} ={' '}
                    {numberToCurrency(qty * -1 * base_cost_rp_per_unit)}
                </Typography>
            ),
        )}
    </ul>
)
