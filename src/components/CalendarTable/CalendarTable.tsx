// types
import type { Dayjs } from 'dayjs'
// vendors
import { memo, type ReactElement } from 'react'
// materials
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons-materials
import DoneAll from '@mui/icons-material/DoneAll'
import MonetizationOn from '@mui/icons-material/MonetizationOn'
import WorkHistory from '@mui/icons-material/WorkHistory'
//
import formatNumber from '@/utils/formatNumber'

/**
 * @deprecated UNUSED will be removed if not used in future
 */
const CalendarTable = memo(function CalendarTable({
    anchorDate,
    eventButtons,
    view,
}: {
    view: 'month'
    anchorDate: Dayjs
    eventButtons: {
        [key: string]: Array<Parameters<typeof RentInfoCard>[0]>
    }
}) {
    return (
        <Paper>
            <TableContainer sx={{ maxHeight: '75svh' }}>
                <Table stickyHeader aria-label="sticky table">
                    {view === 'month' && <FullMonthHead />}

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
        </Paper>
    )
})

/**
 * @deprecated UNUSED will be removed if not used in future
 */
export default CalendarTable

const FullMonthHead = () => (
    <TableHead>
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
    </TableHead>
)

const FullMonthTableRows = ({
    anchorDate,
    eventButtons,
}: {
    anchorDate: Dayjs
    eventButtons: {
        [key: string]: Array<Parameters<typeof RentInfoCard>[0]>
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
                    const bgColor = dayId === 7 ? 'Background' : undefined
                    const dayOfTheMonth =
                        dayId + weekIndex * 7 - startDate.day() + 1
                    const isOutsideMonth =
                        dayOfTheMonth < 1 ||
                        dayOfTheMonth > anchorDate.daysInMonth()

                    return (
                        <TableCell
                            key={dayId}
                            sx={{
                                pt: 0,
                                px: 1.25,
                                bgcolor: bgColor,
                            }}>
                            {isOutsideMonth ? null : (
                                <>
                                    <Paper
                                        sx={{
                                            position: 'sticky',
                                            top: '3.9em',
                                            zIndex: '1',
                                            py: 2,
                                            px: 1.5,
                                            boxShadow: 'none',
                                            bgcolor: bgColor,
                                            backgroundImage:
                                                dayId === 7
                                                    ? 'none'
                                                    : undefined,
                                        }}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor:
                                                    dayId === 7
                                                        ? undefined
                                                        : 'success.main',
                                                fontWeight: 'bold',
                                                fontSize: '1em',
                                            }}>
                                            {dayOfTheMonth}
                                        </Avatar>
                                    </Paper>

                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={1}
                                        sx={{
                                            '& > *': {
                                                mb: 0.5,
                                            },
                                        }}>
                                        {eventButtons[
                                            startDate
                                                .add(dayOfTheMonth - 1, 'day')
                                                .format('YYYY-MM-DD')
                                        ]?.map((props, i) => (
                                            <RentInfoCard key={i} {...props} />
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

function RentInfoCard({
    rentUnit,
    rentFor,
    renterId,
    unitName,
    shortUuid,
    onClick,
    isDone,
    isPaid,
}: {
    rentUnit: string
    rentFor: number
    renterId?: number
    unitName: string
    shortUuid: string
    onClick: () => void
    isDone: boolean
    isPaid: boolean
}) {
    return (
        <Card
            sx={{
                minWidth: '10em',
            }}>
            <CardActionArea onClick={onClick}>
                <Alert
                    severity={isDone && isPaid ? 'success' : 'warning'}
                    variant={isDone && isPaid ? 'standard' : 'outlined'}
                    icon={
                        <div>
                            {isPaid && (
                                <CustomTooltip title="Lunas">
                                    <MonetizationOn />
                                </CustomTooltip>
                            )}

                            {isDone ? (
                                <CustomTooltip title="Pekerjaan Selesai">
                                    <DoneAll />
                                </CustomTooltip>
                            ) : (
                                <CustomTooltip title="Terjadwal">
                                    <WorkHistory />
                                </CustomTooltip>
                            )}
                        </div>
                    }>
                    {[
                        shortUuid,
                        renterId ? `#${renterId} ` : '',
                        formatNumber(rentFor) + ' ' + rentUnit,
                        unitName,
                    ].map((text, i) => (
                        <Typography
                            key={i}
                            lineHeight="1.3em"
                            variant="caption"
                            fontFamily="monospace"
                            component="div"
                            gutterBottom
                            textTransform="uppercase">
                            {text}
                        </Typography>
                    ))}
                </Alert>
            </CardActionArea>
        </Card>
    )
}

function CustomTooltip({
    children,
    title,
}: {
    children: ReactElement
    title: string
}) {
    return (
        <Tooltip title={title} arrow placement="right">
            {children}
        </Tooltip>
    )
}

export type CalendarTableProps = Parameters<typeof CalendarTable>[0]
