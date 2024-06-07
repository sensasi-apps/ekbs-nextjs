// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import IconButton from '@/components/IconButton'
import PrintHandler from '@/components/PrintHandler'
import Skeletons from '@/components/Global/Skeletons'
import ScrollableXBox from '@/components/ScrollableXBox'
// utils
import formatNumber from '@/utils/formatNumber'
import useDisablePage from '@/hooks/useDisablePage'

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
export default function PalmBuncesPayrollMonthlyReport() {
    useDisablePage()

    const { query } = useRouter()

    const selectedDate = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    const { data, mutate, isLoading, isValidating } = useSWR<ApiResponseType>([
        'palm-bunches/payment-monthly-report',
        {
            year: selectedDate.format('YYYY'),
            month: selectedDate.format('MM'),
        },
    ])

    return (
        <AuthLayout title="Alur Penerimaan TBS">
            <Container maxWidth="sm">
                <FlexColumnBox>
                    <ScrollableXBox>
                        <MonthPicker disabled={isLoading || isValidating} />

                        <IconButton
                            title="Refresh"
                            disabled={isLoading || isValidating}
                            icon={RefreshIcon}
                            onClick={() => mutate()}
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
                                        component="h6"
                                        fontSize="1.2rem"
                                        align="center"
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
        </AuthLayout>
    )
}

const CURR_MONTH = dayjs().startOf('month')
const BOLD_ROW_SX = {
    '& > td': {
        fontWeight: 'bold',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
    },
}

function MonthPicker({ disabled }: { disabled: boolean }) {
    const { query, replace } = useRouter()

    const value = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    return (
        <DatePicker
            disabled={disabled}
            label="Bulan"
            openTo="month"
            format="MMMM YYYY"
            value={value}
            minDate={dayjs('2023-10-01')}
            maxDate={dayjs().startOf('month')}
            onAccept={date =>
                date
                    ? replace({
                          query: {
                              year: date?.format('YYYY'),
                              month: date?.format('MM'),
                          },
                      })
                    : undefined
            }
            views={['year', 'month']}
            sx={{
                maxWidth: 300,
            }}
            slotProps={{
                textField: {
                    fullWidth: false,
                },
            }}
        />
    )
}

function MainTable({ data }: { data: ApiResponseType }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableBody>
                    {data.map((item, i) => (
                        <TableRow
                            key={i}
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
