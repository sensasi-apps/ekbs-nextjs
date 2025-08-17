// vendors
import { useSearchParams } from 'next/navigation'
// materials
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
// components
import ScrollableXBox from '@/components/ScrollableXBox'

const FAKE_ONCLICK = () => undefined

export function TypeFilterChips() {
    const searchParams = useSearchParams()
    const type = searchParams?.get('type')

    /**
     * state value is set on StateFilterChips component
     *
     * @see [`<StateFilterChips />`](..\StateFilterChips\StateFilterChips.tsx)
     */
    const state = searchParams?.get('state') ?? ''

    return (
        <ScrollableXBox>
            <Chip
                label="Semua"
                onClick={type ? undefined : FAKE_ONCLICK}
                color={type ? undefined : 'success'}
                href={'?type=&state=' + state}
                component={Link}
                size="small"
            />
            <Chip
                label="Penjualan Produk (SAPRODI)"
                onClick={type === 'product-sale' ? undefined : FAKE_ONCLICK}
                color={type === 'product-sale' ? 'success' : undefined}
                href={'?type=product-sale&state=' + state}
                component={Link}
                size="small"
            />
            <Chip
                label="Pinjaman (SPP)"
                onClick={type === 'user-loan' ? undefined : FAKE_ONCLICK}
                color={type === 'user-loan' ? 'success' : undefined}
                href={'?type=user-loan' + '&state=' + state}
                component={Link}
                size="small"
            />
            <Chip
                label="Sewa Alat Berat"
                onClick={type === 'rent-item-rent' ? undefined : FAKE_ONCLICK}
                color={type === 'rent-item-rent' ? 'success' : undefined}
                href={'?type=rent-item-rent' + '&state=' + state}
                component={Link}
                size="small"
            />
        </ScrollableXBox>
    )
}
