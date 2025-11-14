// types

import {
    DateTimePicker as MuiDateTimePicker,
    type DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// vendors
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Dayjs } from 'dayjs'
// components
import TextField from '@/components/text-field'

type DateTimePickerProps = MuiDateTimePickerProps<Dayjs>

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
        <LocalizationProvider adapterLocale="id" dateAdapter={AdapterDayjs}>
            <MuiDateTimePicker
                format={format}
                orientation={orientation}
                slots={slots}
                {...props}
            />
        </LocalizationProvider>
    )
}
