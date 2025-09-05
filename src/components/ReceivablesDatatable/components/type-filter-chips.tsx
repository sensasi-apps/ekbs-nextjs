// vendors
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
// materials
import Chip from '@mui/material/Chip'
// components
import ScrollableXBox from '@/components/ScrollableXBox'

export default function TypeFilterChips() {
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
                color={type ? undefined : 'success'}
                href={`?type=&state=${state}`}
                clickable={Boolean(type)}
                component={Link}
                size="small"
            />
            <Chip
                label="Penjualan Produk (SAPRODI)"
                color={type === 'product-sale' ? 'success' : undefined}
                href={`?type=product-sale&state=${state}`}
                clickable={type !== 'product-sale'}
                component={Link}
                size="small"
            />
            <Chip
                label="Pinjaman (SPP)"
                color={type === 'user-loan' ? 'success' : undefined}
                href={`?type=user-loan&state=${state}`}
                component={Link}
                clickable={type !== 'user-loan'}
                size="small"
            />
            <Chip
                label="Sewa Alat Berat"
                color={type === 'rent-item-rent' ? 'success' : undefined}
                href={`?type=rent-item-rent&state=${state}`}
                clickable={type !== 'rent-item-rent'}
                component={Link}
                size="small"
            />
        </ScrollableXBox>
    )
}
