// vendors
import React, { ReactNode, useState } from 'react'
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material'
import { Download, Refresh as RefreshIcon } from '@mui/icons-material'
import dayjs, { Dayjs } from 'dayjs'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
// utils
import ApiUrl from '../../@enums/api-url'
import formatNumber from '@/utils/formatNumber'
import ProductMovementWithSale from '@/dataTypes/mart/product-movement-with-sale'
import toDmy from '@/utils/toDmy'
import { aoaToXlsx } from '@/functions/aoaToXlsx'

export default function SalesReport() {
    const [fromAt, setFromAt] = useState<Dayjs>()
    const [toAt, setToAt] = useState<Dayjs>()

    const isParamsValid = fromAt && toAt

    const {
        data: rows = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ProductMovementWithSale[]>(
        isParamsValid
            ? [
                  ApiUrl.SALES_REPORT,
                  {
                      from_at: fromAt?.format('YYYY-MM-DD'),
                      to_at: toAt?.format('YYYY-MM-DD'),
                  },
              ]
            : undefined,
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
                disabled={false}
                handleDateChange={handleDateChange}
                handleRefresh={() => mutate(rows)}
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
                        disabled={!isParamsValid || isLoading || isValidating}
                    />
                }
            />

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
    disabled,
    handleDateChange,
    handleRefresh,
    downloadButton,
}: {
    disabled: boolean
    handleDateChange: (name: 'fromAt' | 'toAt', date: Dayjs | undefined) => void
    handleRefresh: () => void
    downloadButton: ReactNode
}) {
    return (
        <Box display="flex" gap={1} alignItems="center" mb={4}>
            <DatePicker
                slotProps={{
                    textField: {
                        id: 'fromAt',
                    },
                }}
                label="Dari"
                format="DD-MM-YYYY"
                disabled={disabled}
                minDate={FROM_DATE}
                maxDate={dayjs().endOf('month')}
                onChange={date => handleDateChange('fromAt', date ?? undefined)}
            />

            <DatePicker
                slotProps={{
                    textField: {
                        id: 'toAt',
                    },
                }}
                label="Hingga"
                format="DD-MM-YYYY"
                disabled={disabled}
                minDate={FROM_DATE}
                maxDate={dayjs().endOf('month')}
                onChange={date => handleDateChange('toAt', date ?? undefined)}
            />

            <IconButton
                title="Segarkan"
                icon={RefreshIcon}
                onClick={() => handleRefresh()}
                disabled={disabled}
            />

            {downloadButton}
        </Box>
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
