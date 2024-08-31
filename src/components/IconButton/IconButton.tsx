import type { SvgIconComponent } from '@mui/icons-material'
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip, { TooltipProps } from '../Tooltip'

export default function IconButton({
    title,
    icon: Icon,
    slotProps: { tooltip: tooltipProps } = {},
    ...props
}: IconButtonProps & {
    title: TooltipProps['title']
    icon: SvgIconComponent
    href?: string | URL
    download?: boolean
    children?: never
    slotProps?: {
        tooltip?: Omit<TooltipProps, 'title' | 'children'>
    }
}) {
    return (
        <Tooltip title={title} placement="top" arrow {...tooltipProps}>
            <MuiIconButton size="small" {...props}>
                <Icon />
            </MuiIconButton>
        </Tooltip>
    )
}
