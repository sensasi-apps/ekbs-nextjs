'use client'

// materials
import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
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
                color={!status ? 'success' : undefined}
                label="Semua"
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
                    color={status === 'unfulfilled' ? 'success' : undefined}
                    label="Belum Lengkap"
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
