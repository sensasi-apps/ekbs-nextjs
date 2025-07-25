import MuiTooltip, {
    type TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip'

export type TooltipProps = MuiTooltipProps

/**
 * MuiTooltip with default prop
 *
 * @param placement top
 * @param arrow true
 */
export default function Tooltip({ children, ...restProps }: TooltipProps) {
    return (
        <MuiTooltip placement="top" arrow {...restProps}>
            <span>{children}</span>
        </MuiTooltip>
    )
}
