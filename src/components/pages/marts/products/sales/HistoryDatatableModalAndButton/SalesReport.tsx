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
    Typography,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// utils
import ApiUrl from '../ApiUrl'
import formatNumber from '@/utils/formatNumber'
import PrintHandler from '@/components/PrintHandler'
import ProductMovementWithSale from '@/dataTypes/mart/ProductMovementWithSale'

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
                    <PrintHandler
                        slotProps={{
                            printButton: {
                                size: 'small',
                                disabled:
                                    !isParamsValid || isLoading || isValidating,
                            },
                        }}
                        content={
                            <>
                                <Typography>
                                    Rincian Penjualan — Belayan Mart
                                </Typography>

                                <Typography variant="caption" gutterBottom>
                                    {fromAt?.format('YYYY-MM-DD')} -{' '}
                                    {toAt?.format('YYYY-MM-DD')}
                                </Typography>

                                <MainTable data={rows} />
                            </>
                        }
                    />
                }
            />

            <MainTable data={rows} />
        </>
    )
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
                label="Dari"
                format="YYYY-MM-DD"
                disabled={disabled}
                minDate={FROM_DATE}
                maxDate={dayjs().endOf('month')}
                onChange={date => handleDateChange('fromAt', date ?? undefined)}
            />

            <DatePicker
                label="Hingga"
                format="YYYY-MM-DD"
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

function MainTable({ data: rows }: { data: ProductMovementWithSale[] }) {
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
                        <TableCell>#</TableCell>
                        <TableCell>NO. Struk</TableCell>
                        <TableCell>TGL</TableCell>
                        <TableCell>Waktu</TableCell>
                        <TableCell>Produk</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>HPP (RP)</TableCell>
                        <TableCell>Total HPP (RP)</TableCell>
                        <TableCell>Harga Jual (RP)</TableCell>
                        <TableCell>Total Penjualan (RP)</TableCell>
                        <TableCell>Marjin (RP)</TableCell>
                        <TableCell>Marjin (%)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((data, i) => (
                        <ItemTableRow key={i} index={i} data={data} />
                    ))}
                </TableBody>

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
                                        details.reduce(
                                            (acc, { qty }) => acc - qty,
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
                                            (acc, { warehouse_state }) =>
                                                acc +
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
                                                {
                                                    qty,
                                                    cost_rp_per_unit,
                                                    rp_per_unit,
                                                },
                                            ) =>
                                                acc +
                                                (cost_rp_per_unit +
                                                    rp_per_unit) *
                                                    -qty,
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
                                isNaN(marginPercentageAvg)
                                    ? 0
                                    : marginPercentageAvg,
                                {
                                    maximumFractionDigits: 0,
                                },
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
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

            <TableCell align="right">
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
            </TableCell>

            <TableCell align="right">
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'none',
                    }}>
                    {details.map(({ cost_rp_per_unit, rp_per_unit }) => (
                        <li key={cost_rp_per_unit}>
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

                            const margin = totalSale - totalCost

                            return <li key={i}>{formatNumber(margin)}</li>
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
