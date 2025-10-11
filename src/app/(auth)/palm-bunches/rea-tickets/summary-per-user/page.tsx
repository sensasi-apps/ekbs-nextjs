'use client'

// icons-materials
import Download from '@mui/icons-material/Download'
import Refresh from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import dayjs from 'dayjs'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
// global components
import { AoaTable } from '@/components/aoa-table'
import BackButton from '@/components/back-button'
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import type { Ymd } from '@/types/date-string'
// utils
import aoaToXlsx, { type AoaRows } from '@/utils/aoa-to-xlsx'
import { toYmd } from '@/utils/to-ymd'

export default function Page() {
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const from_date = searchParams?.get('from_date') as Ymd | null
    const till_date = searchParams?.get('till_date') as Ymd | null

    const {
        data = [],
        isLoading,
        mutate,
    } = useSWR<AoaRows>(
        from_date && till_date
            ? [
                  '/palm-bunches/rea-tickets/get-summary-per-user-data',
                  { from_date, till_date },
              ]
            : null,
    )

    return (
        <>
            <BackButton />

            <PageTitle title="Rangkuman Per Pengguna" />

            <Box alignItems="center" display="flex" gap={2} my={2}>
                <Filters
                    disabled={isLoading}
                    onDownload={() =>
                        aoaToXlsx(`Tiket TBS ${from_date}-${till_date}`, data)
                    }
                    onRefresh={(from_date, till_date) => {
                        const query = new URLSearchParams(
                            searchParams?.toString() ?? '',
                        )
                        query.set('from_date', from_date)
                        query.set('till_date', till_date)

                        replace(`?${query.toString()}`)
                        mutate()
                    }}
                />
            </Box>

            <Fade in={isLoading}>
                <LinearProgress />
            </Fade>

            {data.length === 0 && (
                <Divider
                    sx={{
                        mt: 2,
                    }}
                    variant="middle">
                    Tidak ada data
                </Divider>
            )}

            {data.length > 0 && (
                <AoaTable
                    dataRows={data.slice(1)}
                    headers={data[0] as string[]}
                />
            )}
        </>
    )
}

function Filters({
    onRefresh,
    onDownload,
    disabled,
}: {
    onRefresh: (from_date: Ymd, till_date: Ymd) => void
    onDownload: () => void
    disabled: boolean
}) {
    const searchParams = useSearchParams()
    const from_date = searchParams?.get('from_date')
    const till_date = searchParams?.get('till_date')

    const [fromDate, setFromDate] = useState<Ymd | null>(
        from_date ? (from_date as Ymd) : null,
    )
    const [tillDate, setTillDate] = useState<Ymd | null>(
        till_date ? (till_date as Ymd) : null,
    )

    useEffect(() => {
        if (from_date) {
            setFromDate(from_date as Ymd)
        }

        if (till_date) {
            setTillDate(till_date as Ymd)
        }
    }, [from_date, till_date])

    return (
        <>
            <DatePicker
                disabled={disabled}
                label="Dari Tanggal"
                onChange={value => setFromDate(value ? toYmd(value) : null)}
                value={fromDate ? dayjs(fromDate) : null}
            />

            <DatePicker
                disabled={disabled}
                label="Hingga Tanggal"
                onChange={value => setTillDate(value ? toYmd(value) : null)}
                value={tillDate ? dayjs(tillDate) : null}
            />

            <IconButton
                disabled={disabled || !fromDate || !tillDate}
                icon={Refresh}
                onClick={() =>
                    fromDate && tillDate && onRefresh(fromDate, tillDate)
                }
                title="Segarkan"
            />

            <IconButton
                disabled={disabled || !fromDate || !tillDate}
                icon={Download}
                onClick={onDownload}
                title="Unduh"
            />
        </>
    )
}
