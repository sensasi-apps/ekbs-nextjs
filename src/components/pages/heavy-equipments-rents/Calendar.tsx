// types
import type { CalendarTableProps } from '@/components/CalendarTable/CalendarTable'
import type RentItemRent from '@/dataTypes/RentItemRent'
import type { KeyedMutator } from 'swr'
// vendors
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import DatePicker from '@/components/DatePicker'
import CalendarTable from '@/components/CalendarTable'
import { CircularProgress } from '@mui/material'

const HerMonthlyCalendar = memo(function HerMonthlyCalendar({
    onEventClick,
    mutateCallback,
}: {
    onEventClick: (data: RentItemRent) => void
    mutateCallback?: (mutator: KeyedMutator<RentItemRent[]>) => void
}) {
    const [anchorDate, setAnchorDate] = useState(dayjs())

    const {
        data = [],
        mutate,
        isLoading,
        isValidating,
    } = useSWR<RentItemRent[]>([
        'heavy-equipment-rents/monthly-data',
        {
            year: anchorDate.format('YYYY'),
            month: anchorDate.format('MM'),
        },
    ])

    if (mutateCallback) mutateCallback(mutate)

    const isProcessing = isLoading || isValidating

    return (
        <>
            <Box display="flex">
                <DatePicker
                    label="Bulan"
                    openTo="month"
                    format="MMMM YYYY"
                    value={anchorDate}
                    onChange={date => (date ? setAnchorDate(date) : undefined)}
                    views={['year', 'month']}
                    slotProps={{
                        textField: {
                            margin: 'none',
                        },
                    }}
                />
                <IconButton disabled={isProcessing} onClick={() => mutate()}>
                    {isProcessing ? (
                        <CircularProgress size={24} />
                    ) : (
                        <RefreshIcon />
                    )}
                </IconButton>
            </Box>
            <Fade in={isProcessing} unmountOnExit>
                <LinearProgress />
            </Fade>
            <CalendarTable
                view="month"
                anchorDate={anchorDate}
                eventButtons={rentsToEventButtons(data, onEventClick)}
            />
            <InfoBox />
        </>
    )
})

export default HerMonthlyCalendar

function rentsToEventButtons(
    rents: RentItemRent[],
    onEventClick: (data: RentItemRent) => void,
) {
    const eventButtons: CalendarTableProps['eventButtons'] = {}

    rents.forEach(rent => {
        const date = dayjs(rent.for_at).format('YYYY-MM-DD')

        if (!eventButtons[date]) eventButtons[date] = []

        eventButtons[date].push({
            children: `${rent.inventory_item.code} #${rent.by_user?.id ?? ''}`,
            color: !rent.is_paid || !rent.finished_at ? 'warning' : 'success',
            endIcon: rent.is_paid && rent.finished_at ? '✔️' : undefined,
            onClick: () => onEventClick(rent),
        })
    })

    return eventButtons
}

const InfoBox = memo(function InfoBox() {
    return (
        <Box mt={1}>
            <Typography variant="caption">Informasi:</Typography>
            <Box component="ul" m={0}>
                <Typography variant="caption" component="li">
                    Tombol berwarna{' '}
                    <Typography
                        variant="caption"
                        color="success.main"
                        component="span">
                        hijau
                    </Typography>{' '}
                    menandaan bahwa penyewaan telah selesai.
                </Typography>
                <Typography variant="caption" component="li">
                    Tombol berwarna{' '}
                    <Typography
                        variant="caption"
                        color="warning.main"
                        component="span">
                        kuning
                    </Typography>{' '}
                    menandaan bahwa pembayaran atau pekerjaan belum
                    selesai/diinputkan.
                </Typography>
            </Box>
        </Box>
    )
})
