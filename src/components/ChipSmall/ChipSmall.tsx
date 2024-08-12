import { Chip, type ChipProps } from '@mui/material'

/**
 * Ordinary MuiChip component with small size by default.
 */
export function ChipSmall({ sx, ...restProps }: ChipProps) {
    return (
        <Chip size="small" sx={{ alignItems: 'end', ...sx }} {...restProps} />
    )
}
