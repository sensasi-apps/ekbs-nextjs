// types
import type { Dayjs } from 'dayjs'
import type { ButtonProps } from '@mui/material/Button'
// vendors
import { memo } from 'react'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const CalendarTable = memo(function CalendarTable({
    anchorDate,
    eventButtons,
    view,
}: {
    view: 'month'
    anchorDate: Dayjs
    eventButtons: {
        [key: string]: ButtonProps[]
    }
}) {
    return (
        <TableContainer>
            <Table
                sx={{
                    '& .MuiTableCell-root': {
                        border: '1px solid var(--mui-palette-TableCell-border)',
                    },
                }}>
                <TableHead>{view === 'month' && <FullMonthHead />}</TableHead>

                <TableBody>
                    {view === 'month' && (
                        <FullMonthTableRows
                            anchorDate={anchorDate}
                            eventButtons={eventButtons}
                        />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
})

export default CalendarTable

const FullMonthHead = () => (
    <TableRow>
        <TableCell align="center">Senin</TableCell>
        <TableCell align="center">Selasa</TableCell>
        <TableCell align="center">Rabu</TableCell>
        <TableCell align="center">Kamis</TableCell>
        <TableCell align="center">Jumat</TableCell>
        <TableCell align="center">Sabtu</TableCell>
        <TableCell
            align="center"
            sx={{
                bgcolor: 'var(--mui-palette-Alert-errorStandardBg)',
            }}
            className="MuiAlert-standardError">
            Minggu
        </TableCell>
    </TableRow>
)

const FullMonthTableRows = ({
    anchorDate,
    eventButtons,
}: {
    anchorDate: Dayjs
    eventButtons: {
        [key: string]: ButtonProps[]
    }
}) => {
    const nDays = anchorDate.daysInMonth()
    const startDate = anchorDate.startOf('month')
    const nWeeks = Math.ceil((nDays + startDate.day() - 1) / 7)

    return Array.from({ length: nWeeks }, (_, weekIndex) => {
        return (
            <TableRow
                key={weekIndex}
                sx={{
                    verticalAlign: 'top',
                }}>
                {[1, 2, 3, 4, 5, 6, 7].map(dayId => {
                    const bgColor =
                        dayId === 7
                            ? 'var(--mui-palette-Alert-errorStandardBg)'
                            : undefined
                    const dayOfTheMonth =
                        dayId + weekIndex * 7 - startDate.day() + 1
                    const isOutsideMonth =
                        dayOfTheMonth < 1 ||
                        dayOfTheMonth > anchorDate.daysInMonth()

                    return (
                        <TableCell
                            key={dayId}
                            sx={{
                                bgcolor: bgColor,
                            }}>
                            {isOutsideMonth ? null : (
                                <>
                                    <Box textAlign="center" mb={1}>
                                        {dayOfTheMonth}
                                    </Box>

                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={0.5}
                                        sx={{
                                            '& > *': {
                                                mb: 0.5,
                                            },
                                        }}>
                                        {eventButtons[
                                            startDate
                                                .add(dayOfTheMonth - 1, 'day')
                                                .format('YYYY-MM-DD')
                                        ]?.map((buttonProps, i) => (
                                            <EventButton
                                                key={i}
                                                {...buttonProps}
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        )
    })
}

const EventButton = (props: ButtonProps) => (
    <Button
        size="small"
        sx={{
            lineHeight: 1,
            justifyContent: 'flex-start',
            textAlign: 'left',
            px: 0.6,
        }}
        fullWidth
        variant="contained"
        color="success"
        {...props}
    />
)

export type CalendarTableProps = Parameters<typeof CalendarTable>[0]
