'use client'

// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
// components
import LoadingCenter from '@/components/loading-center'
import blinkSxValue from '@/utils/blink-sx-value'

export default function ClmMemberFilterChips() {
    const { push } = useRouter()
    const searchParams = useSearchParams()
    const status = searchParams.get('status')

    const { data } = useSWR<{
        nUnfulfilled: number
    }>('/clm/members/get-filter-stats')

    if (!data) return <LoadingCenter />

    return (
        <>
            <Chip
                label="Semua"
                color={!status ? 'success' : undefined}
                onClick={!status ? undefined : () => push('?status=')}
            />

            <Badge
                badgeContent={data.nUnfulfilled}
                color="error"
                slotProps={{
                    badge: {
                        sx: blinkSxValue,
                    },
                }}>
                <Chip
                    label="Belum Lengkap"
                    color={status === 'unfulfilled' ? 'success' : undefined}
                    onClick={
                        status === 'unfulfilled'
                            ? undefined
                            : () => push('?status=unfulfilled')
                    }
                />
            </Badge>
        </>
    )
}
