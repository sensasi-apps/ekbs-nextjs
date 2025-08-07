// vendors
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    DateTimePicker as MuiDateTimePicker,
    type DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers'
// components
import TextField from '@/components/TextField'

type DateTimePickerProps = MuiDateTimePickerProps

/**
 * A date picker component that uses Day.js as the date library.
 * @param {DatePickerProps} props - DatePickerProps.
 * @param slots - default: { textField: TextField }.
 * @param format - default: `DD-MM-YYYY`.
 */
export default function DateTimePicker({
    slots = { textField: TextField },
    format = 'DD-MM-YYYY HH:mm',
    orientation = 'landscape',
    ...props
}: DateTimePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <MuiDateTimePicker
                slots={slots}
                orientation={orientation}
                format={format}
                {...props}
            />
        </LocalizationProvider>
    )
}
