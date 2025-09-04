// types
import type { Dayjs } from 'dayjs'
import type { DatePickerProps } from '@mui/x-date-pickers'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
// vendors
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import { PickersDay } from '@mui/x-date-pickers'
import Badge from '@mui/material/Badge'
// components
import DatePicker from '@/components/DatePicker'

type YearlyTxDates = { [key: number]: Ymd[] }

const MINIMUM_DATE = dayjs('2023-01-01')
const MAXIMUM_DATE = dayjs().endOf('month')
export const DEFAULT_START_DATE = dayjs().startOf('month')
export const DEFAULT_END_DATE = MAXIMUM_DATE

export default function DatePickers({
    disabled,
    userCashUuid,
    fromDateUseState,
    toDateUseState,
}: {
    disabled: boolean
    userCashUuid: UUID
    fromDateUseState: [Dayjs, Dispatch<SetStateAction<Dayjs>>]
    toDateUseState: [Dayjs, Dispatch<SetStateAction<Dayjs>>]
}) {
    const [fromDate, setFromDate] = fromDateUseState
    const [toDate, setToDate] = toDateUseState

    const [yearCursor, setYearCursor] = useState<number>(
        DEFAULT_START_DATE.year(),
    )
    const [yearlyTxDates, setYearlyTxDates] = useState<YearlyTxDates>()

    useSWR(`wallets/user/${userCashUuid}/tx-dates/${yearCursor}`, null, {
        keepPreviousData: true,
        onSuccess: data => {
            if (data) {
                setYearlyTxDates({
                    ...yearlyTxDates,
                    [yearCursor]: data,
                })
            }
        },
    })

    const datePickersSharedProps: DatePickerProps<Dayjs> = useMemo(
        () => ({
            disabled: disabled,
            slots: {
                day: ({ day, outsideCurrentMonth, ...rest }) => {
                    const isSelected =
                        !outsideCurrentMonth &&
                        yearlyTxDates?.[day.year()]?.includes(
                            day.format('YYYY-MM-DD') as Ymd,
                        )

                    return (
                        <Badge
                            key={day.toString()}
                            color="success"
                            overlap="circular"
                            variant="dot"
                            invisible={!isSelected}>
                            <PickersDay
                                {...rest}
                                outsideCurrentMonth={outsideCurrentMonth}
                                day={day}
                            />
                        </Badge>
                    )
                },
            },
            slotProps: {
                textField: {
                    margin: 'none',
                    size: 'small',
                    fullWidth: true,
                },
            },
            onYearChange: date => setYearCursor(date.year()),
            onMonthChange: date => setYearCursor(date.year()),
        }),
        [disabled, yearlyTxDates],
    )

    return (
        <>
            <DatePicker
                {...datePickersSharedProps}
                label="Dari"
                value={fromDate}
                minDate={MINIMUM_DATE}
                maxDate={toDate}
                onChange={(date, { validationError }) =>
                    validationError
                        ? null
                        : setFromDate(date ?? DEFAULT_START_DATE)
                }
            />

            <DatePicker
                {...datePickersSharedProps}
                label="Hingga"
                value={toDate}
                minDate={fromDate}
                maxDate={DEFAULT_END_DATE}
                onChange={(date, { validationError }) =>
                    validationError ? null : setToDate(date ?? DEFAULT_END_DATE)
                }
            />
        </>
    )
}
