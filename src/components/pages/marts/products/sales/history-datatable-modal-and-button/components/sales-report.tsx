// vendors

// icons-materials
import Download from '@mui/icons-material/Download'
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs, { type Dayjs } from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import useSWR from 'swr'
// components
import DatePicker from '@/components/date-picker'
import IconButton from '@/components/icon-button'
// utils
import type ProductMovementWithSale from '@/modules/mart/types/orms/product-movement-with-sale'
import aoaToXlsx from '@/utils/aoa-to-xlsx'
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

export default function SalesReport() {
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const { fromAt: fromAtQuery, toAt: toAtQuery } = Object.fromEntries(
        searchParams?.entries() ?? [],
    )

    const [fromAt, setFromAt] = useState<Dayjs | undefined>(
        fromAtQuery ? dayjs(fromAtQuery as string) : undefined,
    )
    const [toAt, setToAt] = useState<Dayjs | undefined>(
        toAtQuery ? dayjs(toAtQuery as string) : undefined,
    )

    const isParamsValid = fromAtQuery && fromAtQuery

    const {
        data: rows = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ProductMovementWithSale[]>(
        isParamsValid
            ? [
                  'marts/products/sales/report',
                  {
                      from_at: fromAtQuery,
                      to_at: toAtQuery,
                  },
              ]
            : undefined,
        null,
        {
            revalidateOnMount: false,
        },
    )

    function handleDateChange(
        name: 'fromAt' | 'toAt',
        date: Dayjs | undefined,
    ) {
        if (name === 'fromAt') setFromAt(date)
        if (name === 'toAt') setToAt(date)
    }

    return (
        <>
            <FiltersBox
                disabled={isLoading || isValidating}
                downloadButton={
                    <IconButton
                        disabled={isLoading || isValidating || !rows.length}
                        icon={Download}
                        onClick={() => {
                            if (fromAt && toAt) {
                                handleDownloadExcel(
                                    rows,
                                    `Laporan Penjualan Belayan Mart — ${toDmy(fromAt)} s/d ${toDmy(toAt)} — ${dayjs().format('YYYYMMDDHHmmss')}`,
                                )
                            }
                        }}
                        title="Unduh"
                    />
                }
                fromAt={fromAt}
                handleDateChange={handleDateChange}
                refreshButton={
                    <IconButton
                        disabled={isLoading || isValidating || !fromAt || !toAt}
                        icon={RefreshIcon}
                        onClick={() => {
                            if (
                                fromAt?.format('YYYY-MM-DD') !== fromAtQuery ||
                                toAt?.format('YYYY-MM-DD') !== toAtQuery
                            ) {
                                replace(
                                    `?fromAt=${fromAt?.format('YYYY-MM-DD')}&toAt=${toAt?.format('YYYY-MM-DD')}`,
                                )
                            } else {
                                mutate()
                            }
                        }}
                        title="Segarkan"
                    />
                }
                toAt={toAt}
            />

            <Fade in={isLoading || isValidating}>
                <LinearProgress />
            </Fade>

            <MainTable data={rows} />
        </>
    )
}

function handleDownloadExcel(
    data: ProductMovementWithSale[],
    fileName: string,
) {
    let rowNo = 1
    const rows = data.flatMap(({ details, sale: { no }, at }) => [
        ...details.map(item => {
            const { qty, product_state, warehouse_state, rp_per_unit } = item

            return [
                rowNo++,
                no,
                toDmy(at),
                dayjs(at).format('HH:mm'),
                product_state?.name ?? '',
                -qty,
                warehouse_state?.cost_rp_per_unit ?? 0,
                -qty * (warehouse_state?.cost_rp_per_unit ?? 0),
                rp_per_unit,
                -qty * rp_per_unit,
                -qty * (rp_per_unit - (warehouse_state?.cost_rp_per_unit ?? 0)),
                getMarginPercentage(item),
            ]
        }),
    ])

    return aoaToXlsx(fileName, rows, TABLE_HEADRES)
}

const FROM_DATE = dayjs('2024-01-01').startOf('month')

function FiltersBox({
    fromAt,
    toAt,
    disabled,
    handleDateChange,
    refreshButton,
    downloadButton,
}: {
    fromAt: Dayjs | undefined
    toAt: Dayjs | undefined
    disabled: boolean
    handleDateChange: (name: 'fromAt' | 'toAt', date: Dayjs | undefined) => void
    refreshButton: ReactNode
    downloadButton: ReactNode
}) {
    return (
        <>
            <Box alignItems="center" display="flex" gap={1} mb={4}>
                <DatePicker
                    disabled={disabled}
                    format="DD-MM-YYYY"
                    label="Dari"
                    maxDate={dayjs().endOf('month')}
                    minDate={FROM_DATE}
                    onChange={date =>
                        handleDateChange('fromAt', date ?? undefined)
                    }
                    slotProps={{
                        textField: {
                            id: 'fromAt',
                        },
                    }}
                    value={fromAt ?? null}
                />

                <DatePicker
                    disabled={disabled}
                    format="DD-MM-YYYY"
                    label="Hingga"
                    maxDate={dayjs().endOf('month')}
                    minDate={FROM_DATE}
                    onChange={date =>
                        handleDateChange('toAt', date ?? undefined)
                    }
                    slotProps={{
                        textField: {
                            id: 'toAt',
                        },
                    }}
                    value={toAt ?? null}
                />

                {refreshButton}

                {downloadButton}
            </Box>
        </>
    )
}

const TABLE_HEADRES = [
    '#',
    'NO. Struk',
    'TGL',
    'Waktu',
    'Produk',
    'Qty',
    'HPP (RP)',
    'Total HPP (RP)',
    'Harga Jual (RP)',
    'Total Penjualan (RP)',
    'Marjin (RP)',
    'Marjin (%)',
]

function MainTable({ data: rows }: { data: ProductMovementWithSale[] }) {
    return (
        <TableContainer>
            <Table
                aria-label="sales report"
                size="small"
                sx={{
                    // MINIMUM PADDING
                    '& td, & th': {
                        padding: '4px 8px',
                    },
                    whiteSpace: 'nowrap',
                }}>
                <TableHead>
                    <TableRow>
                        {TABLE_HEADRES.map(header => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((data, i) => (
                        <ItemTableRow data={data} index={i} key={data.uuid} />
                    ))}
                </TableBody>

                <TheFooter rows={rows} />
            </Table>
        </TableContainer>
    )
}

function TheFooter({ rows }: { rows: ProductMovementWithSale[] }) {
    const marginPercentages = rows.map(row =>
        row.details.map(getMarginPercentage),
    )

    const marginPercentageAvg =
        marginPercentages.reduce(
            (acc, percentages) =>
                acc +
                percentages.reduce((acc, percentage) => acc + percentage, 0),
            0,
        ) / marginPercentages.flat().length

    return (
        <TableFooter>
            <TableRow>
                <TableCell
                    align="right"
                    colSpan={5}
                    sx={{
                        textTransform: 'uppercase',
                    }}>
                    Total
                </TableCell>

                <TableCell align="right">
                    {formatNumber(
                        rows.reduce(
                            (acc, { details }) =>
                                acc +
                                details.reduce((acc, { qty }) => acc - qty, 0),
                            0,
                        ),
                    )}
                </TableCell>

                <TableCell align="right" colSpan={2}>
                    {formatNumber(
                        rows.reduce(
                            (acc, { details }) =>
                                acc +
                                details.reduce(
                                    (acc, { warehouse_state, qty }) =>
                                        acc +
                                        -qty *
                                            (warehouse_state?.cost_rp_per_unit ??
                                                0),
                                    0,
                                ),
                            0,
                        ),
                    )}
                </TableCell>

                <TableCell align="right" colSpan={2}>
                    {formatNumber(
                        rows.reduce(
                            (acc, { details }) =>
                                acc +
                                details.reduce(
                                    (
                                        acc,
                                        { qty, cost_rp_per_unit, rp_per_unit },
                                    ) =>
                                        acc +
                                        (cost_rp_per_unit + rp_per_unit) * -qty,
                                    0,
                                ),
                            0,
                        ),
                    )}
                </TableCell>

                <TableCell align="right">
                    {formatNumber(
                        rows.reduce(
                            (acc, { details }) =>
                                acc +
                                details.reduce(
                                    (
                                        acc,
                                        {
                                            qty,
                                            cost_rp_per_unit,
                                            rp_per_unit,
                                            warehouse_state,
                                        },
                                    ) =>
                                        acc +
                                        -qty *
                                            (cost_rp_per_unit +
                                                rp_per_unit -
                                                (warehouse_state?.cost_rp_per_unit ??
                                                    0)),
                                    0,
                                ),
                            0,
                        ),
                    )}
                </TableCell>
                <TableCell align="right">
                    {formatNumber(
                        isNaN(marginPercentageAvg) ? 0 : marginPercentageAvg,
                        {
                            maximumFractionDigits: 0,
                        },
                    )}
                </TableCell>
            </TableRow>
        </TableFooter>
    )
}

function ItemTableRow({
    index,
    data: {
        at,
        sale: { no },
        details,
    },
}: {
    index: number
    data: ProductMovementWithSale
}) {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>

            <TableCell>{no}</TableCell>

            <TableCell>{dayjs(at).format('YYYY-MM-DD')}</TableCell>
            <TableCell>{dayjs(at).format('HH:mm')}</TableCell>

            <TableCell align="left">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(({ product_state, product }) => (
                        <li key={product_state?.id}>
                            {product_state?.name ?? product?.name}
                        </li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(({ qty, product_id }) => (
                        <li key={product_id}>{formatNumber(-qty)}</li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(({ warehouse_state, product_id }) => (
                        <li key={product_id}>
                            {formatNumber(
                                warehouse_state?.cost_rp_per_unit ?? 0,
                            )}
                        </li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(({ qty, warehouse_state, product_id }) => (
                        <li
                            key={product_id}
                            style={{
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                            }}>
                            {formatNumber(
                                -qty * (warehouse_state?.cost_rp_per_unit ?? 0),
                            )}
                        </li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(
                        ({ cost_rp_per_unit, rp_per_unit, product_id }) => (
                            <li key={product_id}>
                                {formatNumber(cost_rp_per_unit + rp_per_unit)}
                            </li>
                        ),
                    )}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(
                        ({
                            qty,
                            cost_rp_per_unit,
                            rp_per_unit,
                            product_id,
                        }) => (
                            <li key={product_id}>
                                {formatNumber(
                                    -qty * (cost_rp_per_unit + rp_per_unit),
                                )}
                            </li>
                        ),
                    )}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(
                        ({
                            qty,
                            cost_rp_per_unit,
                            rp_per_unit,
                            warehouse_state,
                            product_id,
                        }) => {
                            const totalCost =
                                -qty * (warehouse_state?.cost_rp_per_unit ?? 0)

                            const totalSale =
                                -qty * (cost_rp_per_unit + rp_per_unit)

                            const marginRp = totalSale - totalCost

                            return (
                                <li key={product_id}>
                                    {formatNumber(marginRp)}
                                </li>
                            )
                        },
                    )}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                    {details.map(item => (
                        <li key={item.product_id}>
                            {formatNumber(getMarginPercentage(item), {
                                maximumFractionDigits: 0,
                            })}
                        </li>
                    ))}
                </ul>
            </TableCell>
        </TableRow>
    )
}

function getMarginPercentage({
    qty,
    cost_rp_per_unit,
    rp_per_unit,
    warehouse_state,
}: ProductMovementWithSale['details'][0]) {
    const totalCost = -qty * (warehouse_state?.cost_rp_per_unit ?? 1)
    const totalSale = -qty * (cost_rp_per_unit + rp_per_unit)

    return totalCost ? (totalSale / totalCost) * 100 - 100 : totalSale
}
