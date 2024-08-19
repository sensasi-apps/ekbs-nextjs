import type { SvgIconComponent } from '@mui/icons-material'
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip, { TooltipProps } from '../Tooltip'

export default function IconButton({
    title,
    icon: Icon,
    ...props
}: IconButtonProps & {
    title: TooltipProps['title']
    icon: SvgIconComponent
    href?: string | URL
    download?: boolean
    children?: never
}) {
    return (
        <Tooltip title={title} placement="left" arrow>
            <MuiIconButton size="small" {...props}>
                <Icon />
            </MuiIconButton>
        </Tooltip>
    )
}
