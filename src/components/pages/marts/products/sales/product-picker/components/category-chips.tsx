// types

// vendors
import { memo, useState } from 'react'
import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'
import type Product from '@/modules/mart/types/orms/product'

function CategoryChips({
    data,
    onSelect,
}: {
    data: Product[]
    onSelect: (category?: string) => void
}) {
    const [value, setValue] = useState<string>()

    if (!data.length) return null

    const categories = data
        .map(product => product.category_name)
        .sort()
        .filter((category, i, arr) => arr.indexOf(category) === i)

    return (
        <ScrollableXBox
            sx={{
                mt: -1.5,
            }}>
            <ChipSmall
                color={value === undefined ? 'success' : undefined}
                label="Semua"
                onClick={() => {
                    setValue(undefined)
                    onSelect(undefined)
                }}
                variant={value === undefined ? 'filled' : 'outlined'}
            />

            {categories.map(category => (
                <ChipSmall
                    color={value === category ? 'success' : undefined}
                    key={category}
                    label={category ?? 'Tanpa Kategori'}
                    onClick={() => {
                        setValue(category)
                        onSelect(category)
                    }}
                    variant={value === category ? 'filled' : 'outlined'}
                />
            ))}
        </ScrollableXBox>
    )
}

export default memo(CategoryChips)
