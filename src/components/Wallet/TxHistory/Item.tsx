import { FC } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import NumericFormat from '@/components/Global/NumericFormat'

const TxHistoryItem: FC<any> = ({
    desc,
    amount,
    variant = 'body2',
    color = undefined,
    ...props
}) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        {...props}>
        <Typography variant={variant} color="text.primary">
            {desc}
        </Typography>
        <Chip
            label={
                <NumericFormat
                    value={amount}
                    prefix="Rp. "
                    decimalScale={0}
                    displayType="text"
                />
            }
            color={color}
            size="small"
            variant="outlined"
        />
    </Box>
)

export default TxHistoryItem
