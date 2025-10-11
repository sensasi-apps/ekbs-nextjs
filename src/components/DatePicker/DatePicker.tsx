// types

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
// vendors
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Dayjs } from 'dayjs'
// components
import TextField from '@/components/TextField'

type DatePickerProps = MuiDatePickerProps<Dayjs>

/**
 * A date picker component that uses Day.js as the date library.
 * @param {DatePickerProps} props - DatePickerProps.
 * @param slots - default: { textField: TextField }.
 * @param format - default: `DD-MM-YYYY`.
 */
export default function DatePicker({
    slots = { textField: TextField },
    format = 'DD-MM-YYYY',
    ...props
}: DatePickerProps) {
    return (
        <LocalizationProvider adapterLocale="id" dateAdapter={AdapterDayjs}>
            <MuiDatePicker format={format} slots={slots} {...props} />
        </LocalizationProvider>
    )
}

export type { DatePickerProps }
