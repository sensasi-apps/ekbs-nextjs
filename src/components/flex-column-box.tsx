import Box, { type BoxProps } from '@mui/material/Box'

export default function FlexColumnBox(props: BoxProps) {
    return <Box display="flex" flexDirection="column" gap={2} {...props} />
}
