// types
import type { BoxProps } from '@mui/material/Box'
import type { TypographyProps } from '@mui/material/Typography'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipProps } from '@mui/material/Chip'
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
            <Box mb={-1.5} display="flex" gap={0.65}>
                {tags?.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        color={isInbound ? 'success' : undefined}
                        size="small"
                        {...chipProps}
                    />
                ))}
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                {...props}>
                <Typography
                    variant="body2"
                    maxWidth="66%"
                    color={isInbound ? 'success.main' : undefined}
                    sx={{ whiteSpace: 'pre-line' }}
                    {...tProps}>
                    {desc}
                </Typography>

                <Chip
                    label={numberToCurrency(amount)}
                    color={isInbound ? 'success' : undefined}
                    size="small"
                    variant="outlined"
                    {...chipProps}
                />
            </Box>
        </>
    )
}
