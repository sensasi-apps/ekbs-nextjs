// types
import type { CalendarTableProps } from '@/components/CalendarTable/CalendarTable'
import type RentItemRent from '@/dataTypes/RentItemRent'
import type { KeyedMutator } from 'swr'
import type YajraDatatable from '@/types/yajra-datatable-response'
// vendors
import { memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import dayjs from 'dayjs'
import useSWR from 'swr'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import DatePicker from '@/components/DatePicker'
import CalendarTable from '@/components/CalendarTable'
// enums
import ApiUrlEnum from './api-url-enum'

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
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

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
            <Box display="flex" py={3}>
                <DatePicker
                    label="Bulan"
                    openTo="month"
                    format="MMMM YYYY"
                    value={selectedDate}
                    onAccept={date =>
                        date
                            ? replace(
                                  `?year=${date.format('YYYY')}&month=${date.format('MM')}`,
                              )
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

            <Fade in={isProcessing}>
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
            onClick: () => onEventClick(rent),
            isPaid: rent.is_paid,
            isDone: Boolean(rent.finished_at),
            renterId: rent.by_user?.id,
            unitName: rent.inventory_item.name,
            shortUuid: rent.short_uuid,
            rentFor: rent.for_n_units,
            rentUnit: rent.rate_unit,
        })
    })

    return eventButtons
}
