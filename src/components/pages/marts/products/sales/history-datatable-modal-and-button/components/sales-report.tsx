// vendors
import React, { type ReactNode, useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import useSWR from 'swr'
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
// icons-materials
import Download from '@mui/icons-material/Download'
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
// utils
import type ProductMovementWithSale from '@/dataTypes/mart/product-movement-with-sale'
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'
import { aoaToXlsx } from '@/functions/aoaToXlsx'
import { useRouter } from 'next/router'

export default function SalesReport() {
    const {
        replace,
        query: { fromAt: fromAtQuery, toAt: toAtQuery },
    } = useRouter()

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
                fromAt={fromAt}
                toAt={toAt}
                disabled={isLoading || isValidating}
                handleDateChange={handleDateChange}
                refreshButton={
                    <IconButton
                        title="Segarkan"
                        icon={RefreshIcon}
                        onClick={() => {
                            if (
                                fromAt?.format('YYYY-MM-DD') !== fromAtQuery ||
                                toAt?.format('YYYY-MM-DD') !== toAtQuery
                            ) {
                                replace({
                                    query: {
                                        fromAt: fromAt?.format('YYYY-MM-DD'),
                                        toAt: toAt?.format('YYYY-MM-DD'),
                                    },
                                })
                            } else {
                                mutate()
                            }
                        }}
                        disabled={isLoading || isValidating || !fromAt || !toAt}
                    />
                }
                downloadButton={
                    <IconButton
                        title="Unduh"
                        icon={Download}
                        onClick={() => {
                            if (fromAt && toAt) {
                                handleDownloadExcel(
                                    rows,
                                    `Laporan Penjualan Belayan Mart — ${toDmy(fromAt)} s/d ${toDmy(toAt)} — ${dayjs().format('YYYYMMDDHHmmss')}`,
                                )
                            }
                        }}
                        disabled={isLoading || isValidating || !rows.length}
                    />
                }
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
            <Box display="flex" gap={1} alignItems="center" mb={4}>
                <DatePicker
                    slotProps={{
                        textField: {
                            id: 'fromAt',
                        },
                    }}
                    value={fromAt ?? null}
                    label="Dari"
                    format="DD-MM-YYYY"
                    disabled={disabled}
                    minDate={FROM_DATE}
                    maxDate={dayjs().endOf('month')}
                    onChange={date =>
                        handleDateChange('fromAt', date ?? undefined)
                    }
                />

                <DatePicker
                    slotProps={{
                        textField: {
                            id: 'toAt',
                        },
                    }}
                    value={toAt ?? null}
                    label="Hingga"
                    format="DD-MM-YYYY"
                    disabled={disabled}
                    minDate={FROM_DATE}
                    maxDate={dayjs().endOf('month')}
                    onChange={date =>
                        handleDateChange('toAt', date ?? undefined)
                    }
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
                size="small"
                aria-label="sales report"
                sx={{
                    whiteSpace: 'nowrap',
                    // MINIMUM PADDING
                    '& td, & th': {
                        padding: '4px 8px',
                    },
                }}>
                <TableHead>
                    <TableRow>
                        {TABLE_HEADRES.map((header, i) => (
                            <TableCell key={i}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((data, i) => (
                        <ItemTableRow key={i} index={i} data={data} />
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
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ product_state, product }, i) => (
                        <li key={i}>{product_state?.name ?? product?.name}</li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ qty }, i) => (
                        <li key={i}>{formatNumber(-qty)}</li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ warehouse_state }, i) => (
                        <li key={i}>
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
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ qty, warehouse_state }, i) => (
                        <li
                            key={i}
                            style={{
                                padding: 0,
                                margin: 0,
                                listStyle: 'none',
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
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ cost_rp_per_unit, rp_per_unit }, i) => (
                        <li key={i}>
                            {formatNumber(cost_rp_per_unit + rp_per_unit)}
                        </li>
                    ))}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(
                        ({ qty, cost_rp_per_unit, rp_per_unit }, i) => (
                            <li key={i}>
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
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(
                        (
                            {
                                qty,
                                cost_rp_per_unit,
                                rp_per_unit,
                                warehouse_state,
                            },
                            i,
                        ) => {
                            const totalCost =
                                -qty * (warehouse_state?.cost_rp_per_unit ?? 0)

                            const totalSale =
                                -qty * (cost_rp_per_unit + rp_per_unit)

                            const marginRp = totalSale - totalCost

                            return <li key={i}>{formatNumber(marginRp)}</li>
                        },
                    )}
                </ul>
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map((item, i) => (
                        <li key={i}>
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
