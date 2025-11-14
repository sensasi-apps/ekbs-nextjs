import Chip, { type ChipProps } from '@mui/material/Chip'

/**
 * Ordinary MuiChip component with small size by default.
 */
export default function ChipSmall(props: ChipProps) {
    return (
        <Chip
            size="small"
            sx={{
                fontSize: '0.75rem',
            }}
            {...props}
        />
    )
}
