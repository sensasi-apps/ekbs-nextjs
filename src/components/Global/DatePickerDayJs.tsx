// types
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'
// vendors
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function DatePicker(props: MuiDatePickerProps<Dayjs>) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiDatePicker format="DD-MM-YYYY" {...props} />
        </LocalizationProvider>
    )
}
