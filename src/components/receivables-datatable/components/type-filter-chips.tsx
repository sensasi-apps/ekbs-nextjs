// vendors

// materials
import Chip from '@mui/material/Chip'
import { useSearchParams } from 'next/navigation'
import Link from '@/components/next-link'
// components
import ScrollableXBox from '@/components/scrollable-x-box'
import BusinessUnit from '@/enums/business-unit'

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
                clickable={Boolean(type)}
                color={type ? undefined : 'success'}
                component={Link}
                href={`?type=&state=${state}`}
                label="Semua"
                size="small"
            />
            <Chip
                clickable={type !== 'product-sale'}
                color={type === 'product-sale' ? 'success' : undefined}
                component={Link}
                href={`?type=product-sale&state=${state}`}
                label="Penjualan Produk (SAPRODI)"
                size="small"
            />
            <Chip
                clickable={type !== 'user-loan'}
                color={type === 'user-loan' ? 'success' : undefined}
                component={Link}
                href={`?type=user-loan&state=${state}`}
                label="Pinjaman (SPP)"
                size="small"
            />
            <Chip
                clickable={type !== 'rent-item-rent'}
                color={type === 'rent-item-rent' ? 'success' : undefined}
                component={Link}
                href={`?type=rent-item-rent&state=${state}`}
                label="Sewa Alat Berat"
                size="small"
            />

            <Chip
                clickable={type !== `${BusinessUnit.BENGKEL}`}
                color={
                    type === `${BusinessUnit.BENGKEL}` ? 'success' : undefined
                }
                component={Link}
                href={`?type=${BusinessUnit.BENGKEL}&state=${state}`}
                label="Belayan Spare Parts"
                size="small"
            />
        </ScrollableXBox>
    )
}
