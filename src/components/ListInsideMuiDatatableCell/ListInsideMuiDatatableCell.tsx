// vendors
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'

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
            margin={0}
            paddingLeft="1em"
            lineHeight="unset"
            whiteSpace="nowrap"
            {...list}>
            {listItems.map((item, index) => (
                <Box component="li" key={index} {...listItem}>
                    {renderItem(item)}
                </Box>
            ))}
        </Box>
    )
}
