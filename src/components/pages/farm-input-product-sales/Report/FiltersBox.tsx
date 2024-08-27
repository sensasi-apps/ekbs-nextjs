// vendors
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
// icons
// import BackupTableIcon from '@mui/icons-material/BackupTable'
import RefreshIcon from '@mui/icons-material/Refresh'
// import { apiUrl } from '@/pages/farm-input-product-sales/report'

const MAX_DATE = dayjs().endOf('month')
const MIN_DATE = dayjs('2024-01-01')

export default function FiltersBox({
    disabled,
    onRefresh,
}: {
    disabled: boolean
    onRefresh: () => void
}) {
    const {
        query: { from_date, till_date },
        replace,
    } = useRouter()

    const [fromDate, setFromDate] = useState<Dayjs | null>(
        from_date ? dayjs(from_date as string) : null,
    )
    const [tillDate, setTillDate] = useState<Dayjs | null>(
        till_date ? dayjs(till_date as string) : null,
    )

    useEffect(() => {
        if (from_date) {
            setFromDate(dayjs(from_date as string))
        }

        if (till_date) {
            setTillDate(dayjs(till_date as string))
        }
    }, [from_date, till_date])

    return (
        <Box display="flex" gap={2}>
            <DatePicker
                disabled={disabled}
                label="Dari Tanggal"
                minDate={MIN_DATE}
                disableHighlightToday
                maxDate={tillDate ?? MAX_DATE}
                value={fromDate}
                onChange={value => setFromDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
            />

            <DatePicker
                disabled={disabled}
                label="Hingga Tanggal"
                minDate={fromDate ?? MIN_DATE}
                disableHighlightToday
                maxDate={MAX_DATE}
                value={tillDate}
                onChange={value => setTillDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
            />

            <IconButton
                title="Segarkan"
                disabled={!(fromDate || tillDate || disabled)}
                icon={RefreshIcon}
                onClick={() => {
                    const newQuery = {
                        from_date: fromDate?.format('YYYY-MM-DD'),
                        till_date: tillDate?.format('YYYY-MM-DD'),
                    }

                    const isQueryChanged =
                        JSON.stringify(newQuery) !==
                        JSON.stringify({ from_date, till_date })

                    if (isQueryChanged) {
                        replace({
                            query: newQuery,
                        })
                    } else {
                        onRefresh()
                    }
                }}
            />

            {/* <IconButton
                color="success"
                disabled={!Boolean(from_date || till_date) || disabled}
                title="Unduh Excel"
                icon={BackupTableIcon}
                href={`${
                    process.env.NEXT_PUBLIC_BACKEND_URL
                }/${apiUrl}?from_date=${fromDate?.format(
                    'YYYY-MM-DD',
                )}&till_date=${tillDate?.format('YYYY-MM-DD')}&excel=true`}
                download
            /> */}
        </Box>
    )
}
