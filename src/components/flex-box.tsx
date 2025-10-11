import Box, { type BoxProps } from '@mui/material/Box'

/**
 * A functional component that renders a Box with flex display and a default gap.
 *
 * @default
 * - display: flex
 * - gap: 1
 */
export default function FlexBox(props: BoxProps) {
    return <Box alignItems="center" display="flex" gap={1} {...props} />
}
