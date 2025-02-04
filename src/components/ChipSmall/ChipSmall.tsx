import Chip, { type ChipProps } from '@mui/material/Chip'

/**
 * Ordinary MuiChip component with small size by default.
 */
export function ChipSmall(props: ChipProps) {
    return <Chip size="small" {...props} />
}
