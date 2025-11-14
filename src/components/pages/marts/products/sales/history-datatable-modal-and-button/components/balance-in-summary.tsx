// vendors

// icons-materials
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs, { Dayjs } from 'dayjs'
import { type ReactNode, useState } from 'react'
import useSWR from 'swr'
// components
import DateTimePicker from '@/components/date-time-picker'
import IconButton from '@/components/icon-button'
import PrintHandler from '@/components/print-handler'
// utils
import formatNumber from '@/utils/format-number'

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
                downloadButton={
                    <PrintHandler
                        documentTitle="Rangkuman Saldo Masuk — Belayan Mart"
                        slotProps={{
                            printButton: {
                                disabled:
                                    !isParamsValid || isLoading || isValidating,
                                size: 'small',
                            },
                        }}>
                        <Box
                            sx={{
                                '*': {
                                    color: 'black !important',
                                },
                                '& td, & th': {
                                    borderBottom: '1px solid',
                                },
                                '& tfoot td': {
                                    borderBottom: 'unset',
                                    fontWeight: 'bold',
                                },
                                textTransform: 'uppercase !important',
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
                handleDateChange={handleDateChange}
                handleRefresh={() => mutate(rows)}
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
        <Box alignItems="center" display="flex" gap={1} mb={4}>
            <DateTimePicker
                disabled={disabled}
                format="DD-MM-YYYY HH:mm"
                label="Dari"
                maxDate={dayjs().endOf('month')}
                minDate={FROM_DATE}
                onChange={date => handleDateChange('fromAt', date ?? undefined)}
                slotProps={{
                    textField: {
                        id: 'fromAt',
                    },
                }}
            />

            <DateTimePicker
                disabled={disabled}
                format="DD-MM-YYYY HH:mm"
                label="Hingga"
                maxDate={dayjs().endOf('month')}
                minDate={FROM_DATE}
                onChange={date => handleDateChange('toAt', date ?? undefined)}
                slotProps={{
                    textField: {
                        id: 'toAt',
                    },
                }}
            />

            <IconButton
                disabled={disabled}
                icon={RefreshIcon}
                onClick={() => handleRefresh()}
                title="Segarkan"
            />

            {downloadButton}
        </Box>
    )
}

function MainTable({ data: rows }: { data: BalanceInSummaryRow[] }) {
    return (
        <Table
            aria-label="sales report"
            size="small"
            sx={{
                '& td, & th': {
                    p: 0.5,
                },
                mt: 2,
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
