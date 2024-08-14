// vendors
import { memo } from 'react'
// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
// utils
import blinkSxValue from '@/utils/blinkSxValue'

const FarmInputsProductsLowQty = memo(function FarmInputsProductsLowQty({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Tooltip title="Persediaan menipis" placement="top" arrow>
            <Box
                fontWeight="bold"
                whiteSpace="nowrap"
                color="warning.main"
                sx={blinkSxValue}
                component="span">
                {children}
            </Box>
        </Tooltip>
    )
})

export default FarmInputsProductsLowQty
