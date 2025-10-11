// types
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipProps } from '@mui/material/Chip'
import type { TypographyProps } from '@mui/material/Typography'
import Typography from '@mui/material/Typography'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function TxHistoryItem({
    desc,
    tags,
    amount,
    slotProps,
    ...props
}: BoxProps & {
    desc?: string | null
    tags?: string[]
    amount: number
    slotProps?: {
        typography?: TypographyProps
        chip?: ChipProps
    }
}) {
    const { typography: tProps, chip: chipProps } = slotProps ?? {}
    const isInbound = amount > 0

    return (
        <>
            <Box display="flex" gap={0.65} mb={-1.5}>
                {tags?.map(tag => (
                    <Chip
                        color={isInbound ? 'success' : undefined}
                        key={tag}
                        label={tag}
                        size="small"
                        {...chipProps}
                    />
                ))}
            </Box>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                {...props}>
                <Typography
                    color={isInbound ? 'success.main' : undefined}
                    maxWidth="66%"
                    sx={{ whiteSpace: 'pre-line' }}
                    variant="body2"
                    {...tProps}>
                    {desc}
                </Typography>

                <Chip
                    color={isInbound ? 'success' : undefined}
                    label={numberToCurrency(amount)}
                    size="small"
                    variant="outlined"
                    {...chipProps}
                />
            </Box>
        </>
    )
}
