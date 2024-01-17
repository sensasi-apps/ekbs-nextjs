// types
import type { BoxProps } from '@mui/material/Box'
import type { TypographyProps } from '@mui/material/Typography'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

const TxHistoryItem = ({
    desc,
    amount,
    variant = 'body2',
    ...props
}: BoxProps & {
    desc?: string | null
    amount: number
    variant?: TypographyProps['variant']
}) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        {...props}>
        <Typography
            variant={variant}
            maxWidth="66%"
            color={(amount ?? 0) > 0 ? 'success.main' : undefined}>
            {desc}
        </Typography>

        <Chip
            label={numberToCurrency(amount)}
            color={(amount ?? 0) > 0 ? 'success' : undefined}
            size="small"
            variant="outlined"
        />
    </Box>
)

export default TxHistoryItem
