// types

import type { UUID } from 'node:crypto'
import Badge from '@mui/material/Badge'
import type { DatePickerProps } from '@mui/x-date-pickers'
// materials
import { PickersDay } from '@mui/x-date-pickers'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
// vendors
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import type { Ymd } from '@/types/date-string'

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
            onMonthChange: date => setYearCursor(date.year()),
            onYearChange: date => setYearCursor(date.year()),
            slotProps: {
                textField: {
                    fullWidth: true,
                    margin: 'none',
                    size: 'small',
                },
            },
            slots: {
                day: ({ day, outsideCurrentMonth, ...rest }) => {
                    const isSelected =
                        !outsideCurrentMonth &&
                        yearlyTxDates?.[day.year()]?.includes(
                            day.format('YYYY-MM-DD') as Ymd,
                        )

                    return (
                        <Badge
                            color="success"
                            invisible={!isSelected}
                            key={day.toString()}
                            overlap="circular"
                            variant="dot">
                            <PickersDay
                                {...rest}
                                day={day}
                                outsideCurrentMonth={outsideCurrentMonth}
                            />
                        </Badge>
                    )
                },
            },
        }),
        [disabled, yearlyTxDates],
    )

    return (
        <>
            <DatePicker
                {...datePickersSharedProps}
                label="Dari"
                maxDate={toDate}
                minDate={MINIMUM_DATE}
                onChange={(date, { validationError }) =>
                    validationError
                        ? null
                        : setFromDate(date ?? DEFAULT_START_DATE)
                }
                value={fromDate}
            />

            <DatePicker
                {...datePickersSharedProps}
                label="Hingga"
                maxDate={DEFAULT_END_DATE}
                minDate={fromDate}
                onChange={(date, { validationError }) =>
                    validationError ? null : setToDate(date ?? DEFAULT_END_DATE)
                }
                value={toDate}
            />
        </>
    )
}
