// vendors
import { memo } from 'react'
// materials
import Box, { BoxProps } from '@mui/material/Box'

const ListInsideMuiDatatableCell = memo(function ListInsideMuiDatatableCell({
    listItems,
    slotProps,
    renderItem = item => item,
}: {
    listItems: any[] | undefined
    slotProps?: {
        list: BoxProps
        listItem: BoxProps
    }
    renderItem?: (item: any) => JSX.Element
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
})

export default ListInsideMuiDatatableCell
