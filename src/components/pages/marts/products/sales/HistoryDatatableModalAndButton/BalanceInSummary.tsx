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
import DateTimePicker from '@/components/DateTimePicker'
import IconButton from '@/components/IconButton'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// utils
import ApiUrl from '../ApiUrl'
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
                  ApiUrl.BALANCE_IN_SUMMARY,
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
                                    Rangkuman Saldo Masuk — Belayan Mart
                                </Typography>
                                <Typography variant="caption" gutterBottom>
                                    {fromAt?.format('YYYY-MM-DD HH:mm')} -{' '}
                                    {toAt?.format('YYYY-MM-DD HH:mm')}
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
            <DateTimePicker
                label="Dari"
                format="YYYY-MM-DD HH:mm"
                disabled={disabled}
                minDate={FROM_DATE}
                maxDate={dayjs().endOf('month')}
                onChange={date => handleDateChange('fromAt', date ?? undefined)}
            />

            <DateTimePicker
                label="Hingga"
                format="YYYY-MM-DD HH:mm"
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
        <TableContainer>
            <Table size="small" aria-label="sales report">
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
        </TableContainer>
    )
}
