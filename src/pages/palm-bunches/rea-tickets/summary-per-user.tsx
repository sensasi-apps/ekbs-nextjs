import type { Ymd } from '@/types/DateString'
// vendors
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
import { toYmd } from '@/functions/toYmd'
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
import AuthLayout from '@/components/auth-layout'
// page components
import { AoaTable } from '@/components/aoa-table'
import { useRouter } from 'next/router'
import { aoaToXlsx, type AoaRows } from '@/functions/aoaToXlsx'
import { useEffect, useState } from 'react'
import BackButton from '@/components/back-button'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

export default function Page() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const {
        query: { from_date, till_date },
        replace,
    } = useRouter()

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

    if (!isAuthHasPermission(PalmBunch.READ_STATISTIC)) {
        return null
    }

    return (
        <AuthLayout title="Rangkuman Per Pengguna">
            <BackButton />

            <Box display="flex" gap={2} alignItems="center" my={2}>
                <Filters
                    disabled={isLoading}
                    onRefresh={(from_date, till_date) => {
                        replace({ query: { from_date, till_date } })
                        mutate()
                    }}
                    onDownload={() =>
                        aoaToXlsx(`Tiket TBS ${from_date}-${till_date}`, data)
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
        </AuthLayout>
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
    const {
        query: { from_date, till_date },
    } = useRouter()

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
