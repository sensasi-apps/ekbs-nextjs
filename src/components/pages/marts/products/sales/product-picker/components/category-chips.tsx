// types
import type Product from '@/dataTypes/mart/Product'
// vendors
import { memo, useState } from 'react'

import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'

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
                label="Semua"
                onClick={() => {
                    setValue(undefined)
                    onSelect(undefined)
                }}
                variant="outlined"
                color={value === undefined ? 'success' : undefined}
            />

            {categories.map((category, i) => (
                <ChipSmall
                    key={i}
                    label={category ?? 'Tanpa Kategori'}
                    color={value === category ? 'success' : undefined}
                    variant="outlined"
                    onClick={() => {
                        setValue(category)
                        onSelect(category)
                    }}
                />
            ))}
        </ScrollableXBox>
    )
}

export default memo(CategoryChips)
