'use client'

import type { Ymd } from '@/types/DateString'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import aoaToXlsx, { type AoaRows } from '@/utils/aoa-to-xlsx'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
// icons-materials
import Download from '@mui/icons-material/Download'
import Refresh from '@mui/icons-material/Refresh'
// global components
import { toYmd } from '@/utils/to-ymd'
import { AoaTable } from '@/components/aoa-table'
import BackButton from '@/components/back-button'
import PageTitle from '@/components/page-title'
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'

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
                  '/palm-bunches/rea-tickets/get-export-data',
                  { from_date, till_date },
              ]
            : null,
    )

    return (
        <>
            <BackButton />

            <PageTitle title="Data tiket" />

            <Box display="flex" gap={2} alignItems="center" my={2}>
                <Filters
                    disabled={isLoading}
                    onRefresh={(from_date, till_date) => {
                        const query = new URLSearchParams(
                            searchParams?.toString() ?? '',
                        )
                        query.set('from_date', from_date)
                        query.set('till_date', till_date)

                        replace(`?${query.toString()}`)
                        mutate()
                    }}
                    onDownload={() =>
                        aoaToXlsx(
                            `Rangkuman Tiket per Pengguna ${from_date}-${till_date}`,
                            data,
                        )
                    }
                />
            </Box>

            <Fade in={isLoading}>
                <LinearProgress />
            </Fade>

            {data.length === 0 && (
                <Divider
                    variant="middle"
                    sx={{
                        mt: 2,
                    }}>
                    Tidak ada data
                </Divider>
            )}

            {data.length > 0 && (
                <AoaTable
                    headers={data[0] as string[]}
                    dataRows={data.slice(1)}
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
                label="Dari Tanggal"
                disabled={disabled}
                value={fromDate ? dayjs(fromDate) : null}
                onChange={value => setFromDate(value ? toYmd(value) : null)}
            />

            <DatePicker
                label="Hingga Tanggal"
                disabled={disabled}
                value={tillDate ? dayjs(tillDate) : null}
                onChange={value => setTillDate(value ? toYmd(value) : null)}
            />

            <IconButton
                disabled={disabled || !fromDate || !tillDate}
                icon={Refresh}
                title="Segarkan"
                onClick={() =>
                    fromDate && tillDate && onRefresh(fromDate, tillDate)
                }
            />

            <IconButton
                disabled={disabled || !fromDate || !tillDate}
                icon={Download}
                title="Unduh"
                onClick={onDownload}
            />
        </>
    )
}
