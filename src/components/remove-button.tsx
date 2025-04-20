// materials
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

export default function RemoveButton({
    isDisabled,
    onClick,
}: {
    isDisabled: boolean
    onClick: IconButtonProps['onClick']
}) {
    return (
        <Tooltip placement="top" arrow title="Hapus">
            <span>
                <IconButton
                    disabled={isDisabled}
                    color="error"
                    size="small"
                    onClick={onClick}>
                    <RemoveCircleIcon />
                </IconButton>
            </span>
        </Tooltip>
    )
}
