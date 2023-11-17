import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export default function CustomHeadButton(props: IconButtonProps) {
    return (
        <Tooltip arrow title={props['aria-label']}>
            <IconButton {...props} />
        </Tooltip>
    )
}
