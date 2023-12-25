// vendors
import { memo } from 'react'
// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
// utils
import blink from '@/utils/cssAnimations/blink'

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
                sx={{
                    animation: `${blink} 1s linear infinite`,
                }}
                component="span">
                {children}
            </Box>
        </Tooltip>
    )
})

export default FarmInputsProductsLowQty
