// vendors

// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { memo } from 'react'
// utils
import blinkSxValue from '@/utils/blink-sx-value'

const FarmInputsProductsLowQty = memo(function FarmInputsProductsLowQty({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Tooltip arrow placement="top" title="Persediaan menipis">
            <Box
                color="warning.main"
                component="span"
                fontWeight="bold"
                sx={blinkSxValue}
                whiteSpace="nowrap">
                {children}
            </Box>
        </Tooltip>
    )
})

export default FarmInputsProductsLowQty
