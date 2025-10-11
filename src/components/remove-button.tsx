// materials

// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export default function RemoveButton({
    isDisabled,
    onClick,
}: {
    isDisabled: boolean
    onClick: IconButtonProps['onClick']
}) {
    return (
        <Tooltip arrow placement="top" title="Hapus">
            <span>
                <IconButton
                    color="error"
                    disabled={isDisabled}
                    onClick={onClick}
                    size="small">
                    <RemoveCircleIcon />
                </IconButton>
            </span>
        </Tooltip>
    )
}
