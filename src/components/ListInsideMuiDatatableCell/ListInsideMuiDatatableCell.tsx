// vendors

import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export default function ListInsideMuiDatatableCell<T>({
    listItems,
    slotProps,
    renderItem = () => null,
}: {
    listItems: T[]
    slotProps?: {
        list: BoxProps
        listItem: BoxProps
    }
    renderItem?: (item: T) => ReactNode
}) {
    if (!listItems?.length) return null

    const { list = {}, listItem = {} } = slotProps || {}

    return (
        <Box
            component="ul"
            lineHeight="unset"
            margin={0}
            paddingLeft="1em"
            whiteSpace="nowrap"
            {...list}>
            {listItems.map(item => (
                <Box component="li" key={item as string} {...listItem}>
                    {renderItem(item)}
                </Box>
            ))}
        </Box>
    )
}
