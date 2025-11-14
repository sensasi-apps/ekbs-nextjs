import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export default function UlInsideMuiDatatableCell({
    children,
}: {
    children: ReactNode
}) {
    return (
        <Box
            component="ul"
            lineHeight="unset"
            margin={0}
            paddingLeft="1em"
            whiteSpace="nowrap">
            {children}
        </Box>
    )
}
