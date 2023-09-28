import React from 'react'

import type { BoxProps } from '@mui/material/Box'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

interface TextProps extends BoxProps {
    label?: string
    helperText?: string
}

const Text: React.FC<TextProps> = ({
    label,
    children,
    helperText,
    ...rest
}) => (
    <Box mb={1} {...rest}>
        {label ? (
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        ) : null}

        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && <div>{children}</div>}

        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </Box>
)

export default Text
