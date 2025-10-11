import MuiIconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { ElementType } from 'react'
import Tooltip, { type TooltipProps } from '../Tooltip'

export default function IconButton({
    title,
    icon: Icon,
    slotProps: { tooltip: tooltipProps } = {},
    ...props
}: IconButtonProps & {
    title: TooltipProps['title']
    icon: ElementType
    href?: string | URL
    download?: boolean
    children?: never
    slotProps?: {
        tooltip?: Omit<TooltipProps, 'title' | 'children'>
    }
}) {
    return (
        <Tooltip arrow placement="top" title={title} {...tooltipProps}>
            <MuiIconButton size="small" {...props}>
                <Icon />
            </MuiIconButton>
        </Tooltip>
    )
}
