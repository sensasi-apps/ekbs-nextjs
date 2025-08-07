// types
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker'
// vendors
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// components
import TextField from '@/components/TextField'

export type DatePickerProps = MuiDatePickerProps

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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <MuiDatePicker slots={slots} format={format} {...props} />
        </LocalizationProvider>
    )
}
