// vendors
import React, { type ReactNode, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// icons-materials
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import DateTimePicker from '@/components/DateTimePicker'
import IconButton from '@/components/IconButton'
// utils
import formatNumber from '@/utils/formatNumber'
import PrintHandler from '@/components/PrintHandler'

type BalanceInSummaryRow = {
    cash_name: string
    summary_rp: number
}

export default function BalanceInSummary() {
    const [fromAt, setFromAt] = useState<Dayjs>()
    const [toAt, setToAt] = useState<Dayjs>()

    const isParamsValid = fromAt && toAt

    const {
        data: rows = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR<BalanceInSummaryRow[]>(
        isParamsValid
            ? [
                  'marts/products/sales/balance-in-summary',
                  {
                      from_at: fromAt?.format('YYYY-MM-DD HH:mm'),
                      to_at: toAt?.format('YYYY-MM-DD HH:mm'),
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
                        documentTitle="Rangkuman Saldo Masuk — Belayan Mart"
                        slotProps={{
                            printButton: {
                                size: 'small',
                                disabled:
                                    !isParamsValid || isLoading || isValidating,
                            },
                        }}>
                        <Box
                            sx={{
                                textTransform: 'uppercase !important',
                                '*': {
                                    color: 'black !important',
                                },
                                '& td, & th': {
                                    borderBottom: '1px solid',
                                },
                                '& tfoot td': {
                                    fontWeight: 'bold',
                                    borderBottom: 'unset',
                                },
                            }}>
                            <Typography>
                                Rangkuman Saldo Masuk — Belayan Mart
                            </Typography>

                            <Typography variant="caption">
                                {fromAt?.format('YYYY-MM-DD HH:mm')} -{' '}
                                {toAt?.format('YYYY-MM-DD HH:mm')}
                            </Typography>

                            <MainTable data={rows} />
                        </Box>
                    </PrintHandler>
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
            <DateTimePicker
                slotProps={{
                    textField: {
                        id: 'fromAt',
                    },
                }}
                label="Dari"
                format="DD-MM-YYYY HH:mm"
                disabled={disabled}
                minDate={FROM_DATE}
                maxDate={dayjs().endOf('month')}
                onChange={date => handleDateChange('fromAt', date ?? undefined)}
            />

            <DateTimePicker
                slotProps={{
                    textField: {
                        id: 'toAt',
                    },
                }}
                label="Hingga"
                format="DD-MM-YYYY HH:mm"
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

function MainTable({ data: rows }: { data: BalanceInSummaryRow[] }) {
    return (
        <Table
            size="small"
            aria-label="sales report"
            sx={{
                mt: 2,
                '& td, & th': {
                    p: 0.5,
                },
            }}>
            <TableHead>
                <TableRow>
                    <TableCell>Kas</TableCell>
                    <TableCell align="right">Jumlah (RP)</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map(({ cash_name, summary_rp }) => (
                    <TableRow key={cash_name}>
                        <TableCell component="th" scope="row">
                            {cash_name}
                        </TableCell>
                        <TableCell align="right">
                            {formatNumber(summary_rp)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">
                        {formatNumber(
                            rows.reduce(
                                (acc, { summary_rp }) => acc + summary_rp,
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
