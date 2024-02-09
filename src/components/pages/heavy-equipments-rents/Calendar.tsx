// types
import type { CalendarTableProps } from '@/components/CalendarTable/CalendarTable'
import type RentItemRent from '@/dataTypes/RentItemRent'
import type { KeyedMutator } from 'swr'
import type YajraDatatable from '@/types/responses/YajraDatatable'
// vendors
import { memo } from 'react'
import { useRouter } from 'next/router'
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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
// components
import DatePicker from '@/components/DatePicker'
import CalendarTable from '@/components/CalendarTable'
// enums
import ApiUrlEnum from './ApiUrlEnum'

const CURRENT_DATE = dayjs()

const HerMonthlyCalendar = memo(function HerMonthlyCalendar({
    onEventClick,
    mutateCallback,
}: {
    onEventClick: (data: RentItemRent) => void
    mutateCallback?: (
        mutator: KeyedMutator<YajraDatatable<RentItemRent>>,
    ) => void
}) {
    const { query, replace } = useRouter()

    const selectedDate = dayjs(
        `${query.year ?? CURRENT_DATE.format('YYYY')}-${
            query.month ?? CURRENT_DATE.format('MM')
        }-01`,
    )

    const { data, mutate, isLoading, isValidating } = useSWR<
        YajraDatatable<RentItemRent>
    >([
        ApiUrlEnum.DATATABLE_DATA,
        {
            year: selectedDate.format('YYYY'),
            month: selectedDate.format('MM'),
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
                    value={selectedDate}
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
                    slotProps={{
                        textField: {
                            margin: 'none',
                        },
                    }}
                />
                <IconButton disabled={isProcessing} onClick={() => mutate()}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Fade in={isProcessing} unmountOnExit>
                <LinearProgress />
            </Fade>

            <CalendarTable
                view="month"
                anchorDate={selectedDate}
                eventButtons={rentsToEventButtons(
                    data?.data ?? [],
                    onEventClick,
                )}
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
            children: rent.short_uuid,
            color: !rent.finished_at ? 'warning' : 'success',
            endIcon: rent.is_paid ? <MonetizationOnIcon /> : undefined,
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
                    menandakan bahwa pekerjaan telah dilaksanakan.
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
                <Typography variant="caption" component="li">
                    <Box display="flex" gap={0.5} alignItems="center">
                        Ikon <MonetizationOnIcon /> menandakan bahwa pembayaran
                        telah dilakukan.
                    </Box>
                </Typography>
            </Box>
        </Box>
    )
})
