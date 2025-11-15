'use client'

// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import DatePicker from '@/components/date-picker'
import FlexColumnBox from '@/components/flex-column-box'
import IconButton from '@/components/icon-button'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/print-handler'
import ScrollableXBox from '@/components/scrollable-x-box'
import Skeletons from '@/components/skeletons'
import useDisablePage from '@/hooks/useDisablePage'
// utils
import formatNumber from '@/utils/format-number'

type ApiResponseType = {
    name: string
    value1?: number | string
    value2?: number | string
    bold?: boolean
}[]

/**
 * PENDING FEATURE
 * @returns useDisablePage
 */
export default function PalmBunchesPayrollMonthlyReport() {
    useDisablePage()

    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const selectedDate = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    const { data, mutate, isLoading, isValidating } = useSWR<ApiResponseType>([
        'palm-bunches/payment-monthly-report',
        {
            month: selectedDate.format('MM'),
            year: selectedDate.format('YYYY'),
        },
    ])

    return (
        <>
            <PageTitle title="Alur Penerimaan TBS" />
            <Container maxWidth="sm">
                <FlexColumnBox>
                    <ScrollableXBox>
                        <MonthPicker disabled={isLoading || isValidating} />

                        <IconButton
                            disabled={isLoading || isValidating}
                            icon={RefreshIcon}
                            onClick={() => mutate()}
                            title="Refresh"
                        />
                    </ScrollableXBox>

                    <Fade in={isLoading || isValidating} unmountOnExit>
                        <span>
                            <Skeletons />
                        </span>
                    </Fade>

                    {data && !isLoading && !isValidating && (
                        <>
                            <span>
                                <PrintHandler
                                    slotProps={{
                                        printButton: {
                                            color: 'success',
                                        },
                                    }}>
                                    <Typography
                                        align="center"
                                        component="h6"
                                        fontSize="1.2rem"
                                        lineHeight={1.2}
                                        mb={2}>
                                        Alur Penerimaan TBS
                                        <br />
                                        Koperasi Belayan Sejahtera
                                        <br />
                                        Bulan {selectedDate.format('MMMM YYYY')}
                                    </Typography>

                                    <MainTable data={data} />
                                </PrintHandler>
                            </span>

                            <MainTable data={data} />
                        </>
                    )}
                </FlexColumnBox>
            </Container>
        </>
    )
}

const CURR_MONTH = dayjs().startOf('month')
const BOLD_ROW_SX = {
    '& > td': {
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        fontWeight: 'bold',
    },
}

function MonthPicker({ disabled }: { disabled: boolean }) {
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const value = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    return (
        <DatePicker
            disabled={disabled}
            format="MMMM YYYY"
            label="Bulan"
            maxDate={dayjs().startOf('month')}
            minDate={dayjs('2023-10-01')}
            onAccept={date =>
                date
                    ? replace(
                          `?year=${date.format('YYYY')}&month=${date.format('MM')}`,
                      )
                    : undefined
            }
            openTo="month"
            slotProps={{
                textField: {
                    fullWidth: false,
                },
            }}
            sx={{
                maxWidth: 300,
            }}
            value={value}
            views={['year', 'month']}
        />
    )
}

function MainTable({ data }: { data: ApiResponseType }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableBody>
                    {data.map(item => (
                        <TableRow
                            key={item.name}
                            sx={item.bold ? BOLD_ROW_SX : undefined}>
                            <TableCell>{item.name.toUpperCase()}</TableCell>

                            <TableCell align="right">
                                {typeof item.value1 === 'number'
                                    ? formatNumber(Math.abs(item.value1))
                                    : item.value1}
                            </TableCell>

                            <TableCell align="right">
                                {typeof item.value2 === 'number'
                                    ? formatNumber(Math.abs(item.value2))
                                    : item.value2}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
