import { useRouter } from 'next/router'
import ScrollableXBox from '@/components/ScrollableXBox'
import ChipSmall from '@/components/ChipSmall'

export function TypeFilterChips() {
    const { replace, query } = useRouter()

    function handleTypeChange(value?: string) {
        replace({
            query: {
                ...query,
                type: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <ChipSmall
                label="Semua"
                onClick={() => handleTypeChange(undefined)}
                color={query.type ? undefined : 'success'}
            />
            <ChipSmall
                label="Penjualan Produk (SAPRODI)"
                onClick={() => handleTypeChange('product-sale')}
                color={query.type === 'product-sale' ? 'success' : undefined}
            />
            <ChipSmall
                label="Pinjaman (SPP)"
                onClick={() => handleTypeChange('user-loan')}
                color={query.type === 'user-loan' ? 'success' : undefined}
            />
            <ChipSmall
                label="Sewa Alat Berat"
                onClick={() => handleTypeChange('rent-item-rent')}
                color={query.type === 'rent-item-rent' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
