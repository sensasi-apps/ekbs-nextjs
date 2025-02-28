// vendors
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
//
import type PalmBunchType from '@/dataTypes/PalmBunch'

export default function ListInsideMuiDatatableCell({
    listItems,
    slotProps,
    renderItem = () => null,
}: {
    listItems: PalmBunchType[]
    slotProps?: {
        list: BoxProps
        listItem: BoxProps
    }
    renderItem?: (item: PalmBunchType) => ReactNode
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
